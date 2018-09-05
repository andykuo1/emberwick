import * as App from 'app/App.js';
import RenderEngine from 'render/RenderEngine.js';
import GameStartState from 'world/GameStartState.js';
import NextGameState from 'world/game/GameExample2.js';

//If starting application...
window.addEventListener('load', (event) => {
  const canvas = document.getElementById('glCanvas');
  const renderer = new RenderEngine(canvas);
  const root = new GameStartState();
  root.nextGameState(new NextGameState());
  App.initialize(root, renderer);
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
