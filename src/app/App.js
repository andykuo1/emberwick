import GameLoop from 'app/GameLoop.js';
import RenderEngine from 'app/RenderEngine.js';

export const INSTANCE = {
  canvas: null,
  renderEngine: null,
  gameLoop: null,
  root: null
};

export function initialize(startState)
{
  const canvas = document.getElementById('glCanvas');
  const renderEngine = new RenderEngine(canvas);
  const gameLoop = new GameLoop();
  const root = startState;

  INSTANCE.canvas = canvas;
  INSTANCE.renderEngine = renderEngine;
  INSTANCE.gameLoop = gameLoop;
  INSTANCE.root = root;

  gameLoop.on("update", (dt, millis) => {
    renderEngine.update();
    if (root && root.canUpdate())
    {
      root.update(dt);
    }
    FPS.update(millis);
  });

  renderEngine.initialize()
    .then(() => root.init(INSTANCE))
    .then(() => gameLoop.start());
};

export function terminate()
{
  INSTANCE.gameLoop.stop();
  INSTANCE.root.exitImmediately();
  INSTANCE.renderEngine.terminate();
};
