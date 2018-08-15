//If starting application...
window.addEventListener('load', (event) => {
  loadApplication();
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
let running = false;

//Loading application...
function loadApplication()
{
  //When loading complete, call start...
  app.onLoad(startApplication);
}

//Starting application...
function startApplication()
{
  running = true;
  app.onStart();

  //Start updating application
  window.requestAnimationFrame(updateApplication);
}

//Updating application...
function updateApplication(time)
{
  if (running)
  {
    const dt = (time - prevtime) / FRAMES_PER_SECOND;

    app.onUpdate(dt);

    prevtime = time;
    window.requestAnimationFrame(updateApplication);
  }
}

//Unloading application...
function unloadApplication()
{
  app.onStop();
  running = false;
  
  app.onUnload();
}
