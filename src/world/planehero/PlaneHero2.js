import { vec3, mat4 } from 'gl-matrix';
import PlaneHero from './PlaneHero.js';

import Renderable from 'world/planehero/Renderable.js';
import EntityTerrain from 'world/planehero/EntityTerrain.js';
import EntitySquare from 'world/planehero/EntitySquare.js';

import LookHelper from 'world/LookHelper.js';

class PlaneHero2 extends PlaneHero
{
  constructor()
  {
    super();

    this.playerID = -1;

    this.lookHelper = new LookHelper();
    this.lookTarget = vec3.create();
    this.lookEntity = null;
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
    this.lookEntity = entityManager.addCustomEntity(new EntitySquare(this));

    entityManager.addCustomEntity(new EntityTerrain(this));
  }

  //Override
  onUpdate(dt)
  {
    this.inputManager.doInputUpdate();
    this.entityManager.update(dt);

    const entityManager = this.entityManager;
    const camera = this.renderer.getActiveCamera();
    const dx = this.left != this.right ? this.left ? -1 : 1 : 0;

    //This is flipped with dz and dy
    const dy = this.up != this.down ? this.up ? -1 : 1 : 0;
    const dz = this.forward != this.backward ? this.forward ? -1 : 1 : 0;

    //camera.updateMove(dx, dz, dy);
    //camera.updateLook(this.lookX, this.lookY);
    //this.lookX = 0;
    //this.lookY = 0;
    camera.onUpdate(dt);

    this.lookHelper.update();
    const et = this.lookEntity.getComponent(Renderable).getTransform();
    mat4.fromTranslation(et, this.lookHelper.getVector());


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
