import { vec3, mat4, quat } from 'gl-matrix';
import PlayableGameState from 'world/PlayableGameState.js';
import Renderable from 'world/components/Renderable.js';

import EntitySquare from './EntitySquare.js';
import LookHelper from 'world/LookHelper.js';

class GameExample2 extends PlayableGameState
{
  constructor()
  {
    super();

    this.entityManager = null;
    this.renderTarget = null;

    this.playerID = -1;

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    this.lookX = 0;
    this.lookY = 0;

    this.lookHelper = new LookHelper();
    this.lookTarget = vec3.create();
    this.lookEntity = null;
  }

  //Override
  onStart()
  {
    super.onStart();

    const app = this.getPrevGameState();
    const entityManager = this.entityManager = app.entityManager;
    const renderTarget = this.renderTarget = app.renderTarget;

    const sceneGraph = renderTarget.getSceneGraph();
    entityManager.registerComponentClass(Renderable);

    const cubeID = entityManager.createEntity();
    const cubeRenderable = entityManager.addComponentToEntity(cubeID, Renderable);
    cubeRenderable._sceneNode.setParent(sceneGraph);
    cubeRenderable._sceneNode.mesh = "cube.mesh";

    this.playerID = cubeID;

    const capsuleID = entityManager.createEntity("rotating");
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";

    const camera = renderTarget.getActiveCamera();
    this.lookHelper.setCamera(camera);
    //camera.position[2] = -10;
    this.lookEntity = entityManager.addCustomEntity(new EntitySquare(this));
  }

  //Override
  onInputUpdate(inputs)
  {
    this.up = inputs.getState("moveUp");
    this.left = inputs.getState("strafeLeft");
    this.down = inputs.getState("moveDown");
    this.right = inputs.getState("strafeRight");
    this.forward = inputs.getState("moveForward");
    this.backward = inputs.getState("moveBackward");

    if (inputs.hasRange("lookDX"))
    {
      this.lookX += inputs.getRange("lookDX") * -1;
    }
    if (inputs.hasRange("lookDY"))
    {
      this.lookY += inputs.getRange("lookDY") * -1;
    }

    if (inputs.hasRange("lookX"))
    {
      this.lookHelper.setX(inputs.getRange("lookX"));
    }
    if (inputs.hasRange("lookY"))
    {
      this.lookHelper.setY(inputs.getRange("lookY"));
    }
  }

  //Override
  onUpdate(dt)
  {
    const entityManager = this.entityManager;
    const camera = this.renderTarget.getActiveCamera();
    const dx = this.left != this.right ? this.left ? -1 : 1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;

    //camera.updateMove(dx, dz, dy);
    //camera.updateLook(this.lookX, this.lookY);
    this.lookX = 0;
    this.lookY = 0;
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
  }
}

export default GameExample2;
