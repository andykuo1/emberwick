import * as App from 'app/App.js';

//import Game from 'world/planehero/PlaneHero.js';
//import Game from 'world/planehero/PlaneHero2.js';
import Game from 'world/snekgamo/SnekGamo.js';

//If starting application...
window.addEventListener('load', (event) => {
  App.initialize(new Game());
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
