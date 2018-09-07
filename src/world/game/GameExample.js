import { mat4 } from 'gl-matrix';
import PlayableGameState from 'world/PlayableGameState.js';
import Renderable from 'world/components/Renderable.js';

class GameExample extends PlayableGameState
{
  constructor()
  {
    super();

    this.entityManager = null;
    this.renderTarget = null;

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    this.lookX = 0;
    this.lookY = 0;
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

    const capsuleID = entityManager.createEntity();
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";
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
  }

  //Override
  onUpdate(dt)
  {
    const entityManager = this.entityManager;
    const camera = this.renderTarget.getActiveCamera();
    const dx = this.left != this.right ? this.left ? 1 : -1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;

    camera.updateMove(dx, dy, dz);
    camera.updateLook(this.lookX, this.lookY);
    camera.onUpdate(dt);

    this.lookX = 0;
    this.lookY = 0;

    for(const renderable of entityManager.getComponentsByClass(Renderable))
    {
      const transform = renderable.getTransform();
      mat4.rotateY(transform, transform, 0.01);
      mat4.rotateZ(transform, transform, 0.01);
      renderable._sceneNode.update(dt);
    }
  }
}

export default GameExample;
