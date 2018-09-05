export const FRAMES_PER_SECOND = 60;

export const INSTANCE = {
  rootState: null,
  renderer: null,
  running: false,
  dt: 0,
  prevtime: 0
};

export function initialize(gameState, renderer)
{
  INSTANCE.rootState = gameState;
  INSTANCE.renderer = renderer;

  const result = renderer.load();

  if (gameState)
  {
    return result.then(() => gameState.init(renderer)).then(() => {
      console.log("[App] New GameState initialized.");

      INSTANCE.running = true;

      //Start the application update loop
      window.requestAnimationFrame(onWindowUpdate);
    });
  }
  else
  {
    return result.then(() => {
      console.log("[App] No GameState found.");
      INSTANCE.running = true;

      //Start the application update loop
      window.requestAnimationFrame(onWindowUpdate);
    });
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

  //Unload renderer
  INSTANCE.renderer.unload();
  INSTANCE.renderer = null;
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
    INSTANCE.renderer.update();
    FPS.update(INSTANCE.dt);

    INSTANCE.prevtime = time;

    //Continue the application update loop
    window.requestAnimationFrame(onWindowUpdate);
  }
}
