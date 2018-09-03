import * as App from 'app/App.js';
import AppState from 'world/AppState.js';
import GameExample from 'world/GameExample2.js';
import RenderEngine from 'app/RenderEngine.js';

//If starting application...
window.addEventListener('load', (event) => {
  App.setCanvas(document.getElementById('glCanvas'));
  App.setRenderEngine(new RenderEngine());
  App.setRootState(new AppState()).nextGameState(new GameExample());
  App.initialize();
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
