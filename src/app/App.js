export const FRAMES_PER_SECOND = 60;

export const INSTANCE = {
  rootState: null,
  running: false,
  dt: 0,
  prevtime: 0
};

export function initialize(gameState)
{
  INSTANCE.rootState = gameState;

  if (gameState)
  {
    return gameState.init().then(() => {
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
