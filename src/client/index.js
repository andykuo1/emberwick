//If starting application...
window.addEventListener('load', (event) => {
  loadApplication();

  //Start updating application
  window.requestAnimationFrame(updateApplication);
});
//If stopping application...
window.addEventListener('beforeunload', (event) => {
  unloadApplication();
});

//Application imports
import App from 'App.js';

//Application constants
const FRAMES_PER_SECOND = 60;
const app = new App();
let prevtime = 0;

//Loading application...
function loadApplication()
{
  app.onLoad();
}

//Updating application...
function updateApplication(time)
{
  const dt = (time - prevtime) / FRAMES_PER_SECOND;

  app.onUpdate(dt);

  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}

//Unloading application...
function unloadApplication()
{
  app.onUnload();
}
