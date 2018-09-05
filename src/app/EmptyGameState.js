import GameState from './GameState.js';

class EmptyGameState extends GameState
{
  constructor(renderer)
  {
    super(renderer);
  }

  //Override
  onLoad(renderer)
  {
    return super.onLoad(renderer);
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
