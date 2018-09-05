import GameState from 'app/GameState.js';

import SceneNode from 'scenegraph/SceneNode.js';
import InputContext from 'input/context/InputContext.js';

import * as InputCodes from 'input/InputCodes.js';
import ActionInput from 'input/context/ActionInput.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

class PlayableGameState extends GameState
{
  constructor()
  {
    super();

    this.inputManager = null;

    this.sceneGraph = null;
    this.inputContext = null;

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  onLoad()
  {
    const parent = this.getPrevGameState();
    this.inputManager = parent.inputManager;

    this.inputContext = new InputContext();
    this.onInputSetup(this.inputContext);
    this.inputManager.addContext(this.inputContext);
    this.inputManager.addCallback(this.onInputUpdate);

    return super.onLoad();
  }

  onInputSetup(inputs)
  {
    inputs.registerState(
      "key", "down", InputCodes.KEY_SPACE, "key", "up", InputCodes.KEY_SPACE,
      new StateInput("moveUp"));
    inputs.registerState(
      "key", "down", InputCodes.KEY_E, "key", "up", InputCodes.KEY_E,
      new StateInput("moveDown"));
    inputs.registerState(
      "key", "down", InputCodes.KEY_A, "key", "up", InputCodes.KEY_A,
      new StateInput("strafeLeft"));
    inputs.registerState(
      "key", "down", InputCodes.KEY_D, "key", "up", InputCodes.KEY_D,
      new StateInput("strafeRight"));
    inputs.registerState(
      "key", "down", InputCodes.KEY_W, "key", "up", InputCodes.KEY_W,
      new StateInput("moveForward"));
    inputs.registerState(
      "key", "down", InputCodes.KEY_S, "key", "up", InputCodes.KEY_S,
      new StateInput("moveBackward"));

    inputs.registerRange("mouse", "move", InputCodes.MOUSE_X, new RangeInput("lookX", -1, 1));
    inputs.registerRange("mouse", "move", InputCodes.MOUSE_Y, new RangeInput("lookY", -1, 1));
  }

  onInputUpdate(inputs) {}

  onUnload()
  {
    this.inputManager.removeCallback(this.onInputUpdate);
    this.inputManager.removeContext(this.inputContext);
  }
}

export default PlayableGameState;
