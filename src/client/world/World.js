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
    this.lookX = 0;
    this.lookY = 0;

    this.inputContext = new InputContext();
    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  create()
  {
    const entityManager = this.entityManager;
    entityManager.createEntity(CubeEntity, this.renderer.sceneGraph);

    const context = this.inputContext;
    context.registerState(
      "key", "down", InputCodes.KEY_W,
      "key", "up", InputCodes.KEY_W,
      new StateInput("moveUp"));
    context.registerState(
      "key", "down", InputCodes.KEY_A,
      "key", "up", InputCodes.KEY_A,
      new StateInput("moveLeft"));
    context.registerState(
      "key", "down", InputCodes.KEY_S,
      "key", "up", InputCodes.KEY_S,
      new StateInput("moveDown"));
    context.registerState(
      "key", "down", InputCodes.KEY_D,
      "key", "up", InputCodes.KEY_D,
      new StateInput("moveRight"));
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
    this.left = input.getState("moveLeft");
    this.down = input.getState("moveDown");
    this.right = input.getState("moveRight");

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
    const dy = this.up != this.down ? this.up ? 1 : -1 : 0;

    this.renderer.camera.updateMove(dx, dy);
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
