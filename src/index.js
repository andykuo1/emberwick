//If starting application...
window.addEventListener('load', (event) => {
  loadApplication();
});
//If stopping application...
window.addEventListener('beforeunload', (event) => {
  if (running)
  {
    stopApplication();
  }

  unloadApplication();
});

//Application imports
import App from 'App.js';

//Application constants
const FRAMES_PER_SECOND = 60;
var prevtime = 0;
var running = false;
var dt;

const app = new App();

//Loading application...
function loadApplication()
{
  app.setCanvas(document.getElementById('glCanvas'));
  
  console.log("Loading application...");

  //When loading complete, call start...
  app.onLoad(startApplication);
}

//Starting application...
function startApplication()
{
  console.log("Starting application...");
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
    dt = time - prevtime;

    app.onUpdate(dt / FRAMES_PER_SECOND);
    FPS.update(dt);

    prevtime = time;
    window.requestAnimationFrame(updateApplication);
  }
}

//Stopping application...
function stopApplication()
{
  console.log("Stopping application...");
  app.onStop();
  running = false;
}

//Unloading application...
function unloadApplication()
{
  console.log("Unloading application...");
  app.onUnload();
}
