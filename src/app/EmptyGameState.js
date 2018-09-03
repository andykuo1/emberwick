import GameState from './GameState.js';

class EmptyGameState extends GameState
{
  constructor()
  {
    super("Empty");
  }

  //Override
  onLoad()
  {
    return super.onLoad();
  }

  //Override
  onStart() {}

  //Override
  onUpdate(dt) {}

  //Override
  onSuspend() {}

  //Override
  onResume() {}

  //Override
  onStop() {}

  //Override
  onUnload() {}
}

export default EmptyGameState;
