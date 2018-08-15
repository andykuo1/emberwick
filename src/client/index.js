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
const app = new App();
let prevtime = 0;
let running = false;

//Loading application...
function loadApplication()
{
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
    const dt = time - prevtime;

    app.onUpdate(dt / FRAMES_PER_SECOND);

    fpsCounter(dt);

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

//FPS counter
let elapsed = 0;
let frames = 0;
function fpsCounter(dt)
{
  ++frames;
  if ((elapsed += dt) >= 1000)
  {
    const label = "FPS: " + frames + "/" + FRAMES_PER_SECOND;
    let element = document.getElementById("fps");
    if (element)
    {
      element.innerHTML = label;
    }
    else
    {
      console.log(label);
    }
    
    frames = 0;
    elapsed -= 1000;
  }
}
