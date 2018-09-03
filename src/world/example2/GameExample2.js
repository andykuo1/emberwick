import { mat4 } from 'gl-matrix';
import GameState from 'app/GameState.js';

import SceneNode from 'scenegraph/SceneNode.js';
import InputContext from 'input/context/InputContext.js';

import * as InputCodes from 'input/InputCodes.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

import GameRenderer from 'world/example2/GameRenderer.js';
import Renderable from './component/Renderable.js';

class GameExample2 extends GameState
{
  constructor()
  {
    super("GameExample2");

    this.sceneGraph = null;
    this.inputContext = null;
    this.renderer = null;
    this.gl = null;

    this.inputManager = null;
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

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  //Override
  onLoad()
  {
    const app = this.getPrevGameState();
    const assets = app.assets;
    this.gl = app.gl;

    this.renderer = new GameRenderer(assets);

    return new Promise((resolve, reject) => {
      this.renderer.load(this.gl, () => resolve(this));
    });
  }

  //Override
  onStart()
  {
    const app = this.getPrevGameState();
    const entityManager = this.entityManager = app.entityManager;
    const inputManager = this.inputManager = app.inputManager;

    const sceneGraph = this.sceneGraph = new SceneNode();
    const context = this.inputContext = new InputContext();
    this.onInputSetup(inputManager, context);
    inputManager.addContext(context);
    inputManager.addCallback(this.onInputUpdate);

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

    const quadID = entityManager.createEntity("rotating");
    const quadRenderable = entityManager.addComponentToEntity(quadID, Renderable);
    quadRenderable._sceneNode.setParent(this.sceneGraph);
    quadRenderable._sceneNode.mesh = "quad.mesh";
  }

  onInputSetup(inputManager, context)
  {
    context.registerState(
      "key", "down", InputCodes.KEY_SPACE,
      "key", "up", InputCodes.KEY_SPACE,
      new StateInput("moveUp"));
    context.registerState(
      "key", "down", InputCodes.KEY_E,
      "key", "up", InputCodes.KEY_E,
      new StateInput("moveDown"));
    context.registerState(
      "key", "down", InputCodes.KEY_A,
      "key", "up", InputCodes.KEY_A,
      new StateInput("strafeLeft"));
    context.registerState(
      "key", "down", InputCodes.KEY_D,
      "key", "up", InputCodes.KEY_D,
      new StateInput("strafeRight"));
    context.registerState(
      "key", "down", InputCodes.KEY_W,
      "key", "up", InputCodes.KEY_W,
      new StateInput("moveForward"));
    context.registerState(
      "key", "down", InputCodes.KEY_S,
      "key", "up", InputCodes.KEY_S,
      new StateInput("moveBackward"));
    context.registerRange(
      "mouse", "move", InputCodes.MOUSE_X,
      new RangeInput("lookX", -1, 1));
    context.registerRange(
      "mouse", "move", InputCodes.MOUSE_Y,
      new RangeInput("lookY", -1, 1));
  }

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
    this.inputManager.doInputUpdate();
    if (this.gl)
    {
      this.renderer.render(this.gl, this);
    }

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

  //Override
  onSuspend() {}

  //Override
  onResume() {}

  //Override
  onStop() {}

  //Override
  onUnload()
  {
    this.renderer.unload(this.gl);
  }

  getSceneGraph()
  {
    return this.sceneGraph;
  }
}

export default GameExample2;
