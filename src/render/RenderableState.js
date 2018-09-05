import GameState from 'gamestate/GameState.js';

import RenderTarget from './RenderTarget.js';

class RenderableState extends GameState
{
  constructor(renderEngine)
  {
    super();

    this.renderEngine = renderEngine;
    this.renderTarget = new RenderTarget(renderEngine);
  }

  //Override
  onLoad()
  {
    return super.onLoad().then(() => this.renderEngine.addRenderTarget(this.renderTarget));
  }

  //Override
  onUnload()
  {
    this.renderEngine.removeRenderTarget(this.renderTarget);
  }

  getRenderTarget()
  {
    return this.renderTarget;
  }

  getRenderEngine()
  {
    return this.renderEngine;
  }
}

export default RenderableState;
