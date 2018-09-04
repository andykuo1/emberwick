import * as App from 'app/App.js';
import RenderEngine from 'render/RenderEngine.js';
import GameStartState from 'world/GameStartState.js';
import NextGameState from 'world/game/GameExample2.js';

//If starting application...
window.addEventListener('load', (event) => {
  const root = new RenderEngine(document.getElementById('glCanvas'));
  root.nextGameState(new GameStartState()).nextGameState(new NextGameState());
  App.initialize(root);
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
