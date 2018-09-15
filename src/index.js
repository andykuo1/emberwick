import * as App from 'app/App.js';

import PlaneHero from 'world/planehero/PlaneHero2.js';

//If starting application...
window.addEventListener('load', (event) => {
  App.initialize(new PlaneHero());
});

//If stopping application...
window.addEventListener('beforeunload', (event) => {
  App.terminate();
});
