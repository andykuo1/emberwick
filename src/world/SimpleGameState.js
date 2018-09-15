import GameState from 'app/GameState.js';

import EntityManager from 'ecs/EntityManager.js';

import InputManager from 'input/InputManager.js';
import InputContext from 'input/context/InputContext.js';

import * as InputCodes from 'input/InputCodes.js';
import ActionInput from 'input/context/ActionInput.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

class SimpleGameState extends GameState
{
  constructor()
  {
    super();

    this.entityManager = new EntityManager();

    this.inputContext = new InputContext();
    this.inputManager = null;

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  //Override
  onLoad(opts)
  {
    if (!opts.canvas) throw new Error("Missing canvas from gamestate opts");
    if (!opts.renderEngine) throw new Error("Missing renderEngine from gamestate opts");

    this.inputManager = new InputManager(opts.canvas);
    this.onInputSetup(this.inputContext);

    return super.onLoad(opts);
  }

  //Override
  onStart(opts)
  {
    this.inputManager.addContext(this.inputContext);
    this.inputManager.addCallback(this.onInputUpdate);
  }

  onInputSetup(input)
  {
    input.registerState(
      "key", "down", InputCodes.KEY_SPACE, "key", "up", InputCodes.KEY_SPACE,
      new StateInput("moveUp"));
    input.registerState(
      "key", "down", InputCodes.KEY_E, "key", "up", InputCodes.KEY_E,
      new StateInput("moveDown"));
    input.registerState(
      "key", "down", InputCodes.KEY_A, "key", "up", InputCodes.KEY_A,
      new StateInput("strafeLeft"));
    input.registerState(
      "key", "down", InputCodes.KEY_D, "key", "up", InputCodes.KEY_D,
      new StateInput("strafeRight"));
    input.registerState(
      "key", "down", InputCodes.KEY_W, "key", "up", InputCodes.KEY_W,
      new StateInput("moveForward"));
    input.registerState(
      "key", "down", InputCodes.KEY_S, "key", "up", InputCodes.KEY_S,
      new StateInput("moveBackward"));

    input.registerRange("mouse", "move", InputCodes.MOUSE_X, new RangeInput("lookDX", -1, 1));
    input.registerRange("mouse", "move", InputCodes.MOUSE_Y, new RangeInput("lookDY", -1, 1));

    input.registerRange("mouse", "pos", InputCodes.MOUSE_X, new RangeInput("lookX", 0, 1));
    input.registerRange("mouse", "pos", InputCodes.MOUSE_Y, new RangeInput("lookY", 0, 1));
  }

  onInputUpdate(input) {}

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.inputManager.doInputUpdate();
    this.entityManager.update(dt);
  }

  //Override
  onStop(opts)
  {
    super.onStop(opts);

    this.inputManager.removeCallback(this.onInputUpdate);
    this.inputManager.removeContext(this.inputContext);
  }

  //Override
  onUnload(opts)
  {
    super.onUnload(opts);

    this.entityManager.clear();
    this.inputManager.destroy();
  }
}

export default SimpleGameState;
