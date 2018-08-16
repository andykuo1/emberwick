import { mat4 } from 'gl-matrix';

import * as InputCodes from 'input/InputCodes.js';
import InputContext from 'input/context/InputContext.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

import EntityManager from 'ecs/EntityManager.js';
import Renderable from 'world/component/Renderable.js';

import CubeEntity from 'world/entity/CubeEntity.js';

class World
{
  constructor(renderer, input, app)
  {
    this.renderer = renderer;
    this.input = input;
    this.app = app;

    this.entityManager = new EntityManager();
    this.entityManager.registerComponentClass(Renderable);

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    this.lookX = 0;
    this.lookY = 0;

    this.inputContext = new InputContext();
    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  create()
  {
    const entityManager = this.entityManager;
    entityManager.createEntity(CubeEntity, this, this.renderer.sceneGraph);

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

    this.input.addContext(this.inputContext);
    this.input.addCallback(this.onInputUpdate);
  }

  destroy()
  {
    this.input.removeCallback(this.onInputUpdate);
    this.input.removeContext(this.inputContext);

    this.entityManager.clear();
  }

  onInputUpdate(input)
  {
    this.up = input.getState("moveUp");
    this.left = input.getState("strafeLeft");
    this.down = input.getState("moveDown");
    this.right = input.getState("strafeRight");
    this.forward = input.getState("moveForward");
    this.backward = input.getState("moveBackward");

    if (input.hasRange("lookX"))
    {
      this.lookX += input.getRange("lookX") * -1;
    }
    if (input.hasRange("lookY"))
    {
      this.lookY += input.getRange("lookY") * -1;
    }
  }

  update(dt)
  {
    const dx = this.left != this.right ? this.left ? 1 : -1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;

    this.renderer.camera.updateMove(dx, dy, dz);
    this.renderer.camera.updateLook(this.lookX, this.lookY);
    this.renderer.camera.onUpdate(dt);

    this.lookX = 0;
    this.lookY = 0;

    for(const renderable of this.entityManager.getComponentsByClass(Renderable))
    {
      const transform = renderable.getTransform();
      mat4.rotateY(transform, transform, 0.01);
      mat4.rotateZ(transform, transform, 0.01);
      renderable._sceneNode.update(dt);
    }
  }
}

export default World;
