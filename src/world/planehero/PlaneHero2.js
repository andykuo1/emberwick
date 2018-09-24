import { vec3, mat4 } from 'gl-matrix';
import PlaneHero from './PlaneHero.js';

import Renderable from 'world/planehero/Renderable.js';
import EntityTerrain from 'world/planehero/EntityTerrain.js';
import EntitySquare from 'world/planehero/EntitySquare.js';

import LookHelper from './LookHelper.js';

class PlaneHero2 extends PlaneHero
{
  constructor()
  {
    super();

    this.playerID = -1;

    this.lookHelper = new LookHelper();
    this.lookTarget = vec3.create();
    this.lookEntity = null;

    this.up = false;
    this.left = false;
    this.down = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
  }

  //Override
  onStart(opts)
  {
    super.onStart(opts);

    this.inputManager.getMouse().allowCursorLock = false;
  }

  //Override
  onWorldCreate()
  {
    const sceneGraph = this.sceneGraph;
    const entityManager = this.entityManager;
    const cubeID = entityManager.createEntity();
    const cubeRenderable = entityManager.addComponentToEntity(cubeID, Renderable);
    cubeRenderable._sceneNode.setParent(sceneGraph);
    cubeRenderable._sceneNode.mesh = "cube.mesh";

    this.playerID = cubeID;

    const capsuleID = entityManager.createEntity("rotating");
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";

    const camera = this.renderer.getActiveCamera();
    this.lookHelper.setCamera(camera);
    camera.pitch = -45;
    //quat.rotateX(camera.rotation, camera.rotation, Math.PI / 4);
    camera.position[1] = -10;
    camera.position[2] = -10;
    camera.ignoreInputUpdate = true;

    this.lookEntity = entityManager.addCustomEntity(new EntitySquare(this));

    entityManager.addCustomEntity(new EntityTerrain(this));
  }

  //Override
  onInputUpdate(inputs)
  {
    this.left = inputs.getState("strafeLeft");
    this.right = inputs.getState("strafeRight");
    this.up = inputs.getState("moveUp");
    this.down = inputs.getState("moveDown");
    this.forward = inputs.getState("moveForward");
    this.backward = inputs.getState("moveBackward");

    if (this.lookHelper)
    {
      if (inputs.hasRange("lookX"))
      {
        this.lookHelper.setX(inputs.getRange("lookX"));
      }
      if (inputs.hasRange("lookY"))
      {
        this.lookHelper.setY(inputs.getRange("lookY"));
      }
    }
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.inputManager.doInputUpdate();
    this.entityManager.update(dt);

    const entityManager = this.entityManager;

    this.lookHelper.update();
    const et = this.lookEntity.getComponent(Renderable).getTransform();
    mat4.fromTranslation(et, this.lookHelper.getVector());


    const dx = this.left != this.right ? this.left ? -1 : 1 : 0;
    //This is flipped with dz and dy
    const dy = this.up != this.down ? this.up ? -1 : 1 : 0;
    const dz = this.forward != this.backward ? this.forward ? -1 : 1 : 0;
    const playerRenderable = entityManager.getComponentFromEntity(Renderable, this.playerID);
    const playerTransform = playerRenderable.getTransform();
    mat4.translate(playerTransform, playerTransform, [dx, dy, dz]);

    for(const renderable of entityManager.getComponentsFromTag(Renderable, "rotating"))
    {
      const transform = renderable.getTransform();
      mat4.rotateY(transform, transform, 0.01);
      mat4.rotateZ(transform, transform, 0.01);
    }

    for(const renderable of entityManager.getComponentsByClass(Renderable))
    {
      renderable._sceneNode.update(dt);
    }

    this.renderer.update();
  }
}

export default PlaneHero2;
