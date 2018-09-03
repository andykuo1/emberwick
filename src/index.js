import * as App from 'app/App.js';
import GameStartState from 'world/GameStartState.js';
import GameExample from 'world/GameExample.js';
import RenderEngine from 'app/RenderEngine.js';

//If starting application...
window.addEventListener('load', (event) => {
  App.setCanvas(document.getElementById('glCanvas'));
  App.setRenderEngine(new RenderEngine());
  App.setRootState(new GameStartState()).nextGameState(new GameExample());
  App.initialize();
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
