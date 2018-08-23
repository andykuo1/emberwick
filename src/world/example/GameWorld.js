import { mat4 } from 'gl-matrix';
import Scene from 'scene/Scene.js';

import * as InputCodes from 'input/InputCodes.js';
import InputContext from 'input/context/InputContext.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

import EntityManager from 'ecs/EntityManager.js';
import Renderable from './component/Renderable.js';

import CubeEntity from './entity/CubeEntity.js';
import CapsuleEntity from './entity/CapsuleEntity.js';

class GameWorld extends Scene
{
  constructor(app)
  {
    super(app);

    this.entityManager = new EntityManager();
    this.entityManager.registerComponentClass(Renderable);

    this.inputContext = new InputContext();
    this.onInputUpdate = this.onInputUpdate.bind(this);

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    this.lookX = 0;
    this.lookY = 0;
  }

  onSceneLoad(gl)
  {
    super.onSceneLoad(gl);
  }

  onSceneStart()
  {
    super.onSceneStart();

    const inputs = this.app.input;
    const entityManager = this.entityManager;
    const cubeID = entityManager.createEntity(CubeEntity, this, this.sceneGraph);
    const cubeRenderable = entityManager.getComponentFromEntity(cubeID, Renderable);
    const capsuleID = entityManager.createEntity(CapsuleEntity, this, cubeRenderable._sceneNode);

    const context = this.inputContext;
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

    inputs.addContext(this.inputContext);
    inputs.addCallback(this.onInputUpdate);
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

  onSceneUpdate(dt)
  {
    const entityManager = this.entityManager;
    const renderer = this.app.renderer;
    const dx = this.left != this.right ? this.left ? 1 : -1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;

    renderer.camera.updateMove(dx, dy, dz);
    renderer.camera.updateLook(this.lookX, this.lookY);
    renderer.camera.onUpdate(dt);

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

  onSceneRender(gl)
  {
  }

  onSceneStop()
  {
    super.onSceneStop();

    const entityManager = this.entityManager;
    const inputs = this.app.input;

    inputs.removeCallback(this.onInputUpdate);
    inputs.removeContext(this.inputContext);

    entityManager.clear();
  }

  onSceneUnload(gl)
  {
    super.onSceneUnload(gl);
  }
}

export default GameWorld;
