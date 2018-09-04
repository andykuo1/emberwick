import { mat4 } from 'gl-matrix';
import PlayableGameState from 'world/PlayableGameState.js';
import Renderable from 'world/components/Renderable.js';

import EntitySquare from './EntitySquare.js';

class GameExample2 extends PlayableGameState
{
  constructor()
  {
    super("GameExample2");

    this.renderer = null;
    this.entityManager = null;

    this.playerID = -1;

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
    const renderer = this.renderer = app.renderer;

    const sceneGraph = this.sceneGraph;

    entityManager.registerComponentClass(Renderable);
    const cubeID = entityManager.createEntity();
    const cubeRenderable = entityManager.addComponentToEntity(cubeID, Renderable);
    cubeRenderable._sceneNode.setParent(this.sceneGraph);
    cubeRenderable._sceneNode.mesh = "cube.mesh";

    this.playerID = cubeID;

    const capsuleID = entityManager.createEntity("rotating");
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";

    entityManager.addCustomEntity(new EntitySquare(this));
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

    if (inputs.hasRange("lookX"))
    {
      this.lookX += inputs.getRange("lookX") * -1;
    }
    if (inputs.hasRange("lookY"))
    {
      this.lookY += inputs.getRange("lookY") * -1;
    }
  }

  //Override
  onUpdate(dt)
  {
    const entityManager = this.entityManager;
    const renderer = this.renderer;
    const dx = this.left != this.right ? this.left ? -1 : 1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;

    //renderer.camera.updateMove(dx, dy, dz);
    //renderer.camera.updateLook(this.lookX, this.lookY);
    //this.lookX = 0;
    //this.lookY = 0;
    renderer.camera.onUpdate(dt);

    const playerRenderable = this.entityManager.getComponentFromEntity(Renderable, this.playerID);
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
