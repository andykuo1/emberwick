import * as App from 'app/App.js';
import GameStartState from 'world/GameStartState.js';
import NextGameState from 'world/game/GameExample2.js';

//If starting application...
window.addEventListener('load', (event) => {
  App.setCanvas(document.getElementById('glCanvas'));
  App.setRootState(new GameStartState()).nextGameState(new NextGameState());
  App.initialize();
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
