export const FRAMES_PER_SECOND = 60;

export const INSTANCE = {
  rootState: null,
  running: false,
  canvas: null,
  gl: null,
  dt: 0,
  prevtime: 0
};

export function setCanvas(canvas)
{
  INSTANCE.canvas = canvas;
  INSTANCE.gl = canvas.getContext('webgl');
};

export function setRootState(gameState)
{
  if (INSTANCE.rootState !== null) throw new Error("App root state already exists");

  if (INSTANCE.running)
  {
    gameState.init().then(() => {
      console.log("[App] New GameState initialized.");

      INSTANCE.rootState = gameState;
    });
  }
  else
  {
    //Will be initailized by App later
    INSTANCE.rootState = gameState;
  }

  return gameState;
};

export function initialize()
{
  if (INSTANCE.canvas === null) throw new Error("Invalid canvas target");
  if (INSTANCE.gl === null) throw new Error("Invalid canvas context target");

  if (INSTANCE.rootState)
  {
    return INSTANCE.rootState.init().then(() => {
      console.log("[App] New GameState initialized.");

      INSTANCE.running = true;

      //Start the application update loop
      window.requestAnimationFrame(onWindowUpdate);
    });
  }
  else
  {
    console.log("[App] No GameState found.");
    INSTANCE.running = true;

    //Start the application update loop
    window.requestAnimationFrame(onWindowUpdate);
    return Promise.resolve();
  }
};

export function terminate()
{
  if (!INSTANCE.running) return;

  //Stop any future updates
  INSTANCE.running = false;

  //Exit all states immediately
  if (INSTANCE.rootState)
  {
    INSTANCE.rootState.exit(true, true);
    INSTANCE.rootState = null;
  }
};

function onWindowUpdate(time)
{
  if (INSTANCE.running)
  {
    INSTANCE.dt = time - INSTANCE.prevtime;

    const state = INSTANCE.rootState;
    if (state && state.canUpdate())
    {
      state.update(INSTANCE.dt / FRAMES_PER_SECOND);
    }
    FPS.update(INSTANCE.dt);

    INSTANCE.prevtime = time;

    //Continue the application update loop
    window.requestAnimationFrame(onWindowUpdate);
  }
}
