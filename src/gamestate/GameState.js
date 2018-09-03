import Eventable from 'util/Eventable.js';

class GameState
{
  constructor(name="DefaultState")
  {
    this.name = name;

    this._prevState = null;
    this._nextState = null;

    this._cacheNextState = null;
    this._cacheExit = false;

    this._isLoaded = false;
    this._suspended = false;

    this.registerEvent("load");
    this.registerEvent("unload");
  }

  init(prevState=null, startOnLoad=true)
  {
    if (this._isLoaded) throw new Error("Cannot initialize state already loaded");
    if (this._prevState !== null) throw new Error("Cannot initialize state already initialized from another state");

    //Link previous state so on exit will return to prevState
    //However, this does NOT set next state for prevState
    //In other words, prevState will not update this state.
    //It is up to the caller to manage the state.
    //Also, prevState is null ONLY if it is a root state.
    this._prevState = prevState;

    //NOTE: Suspended could be active before initailization to never run update
    //this._suspended = false;

    //Load and start current game state
    console.log("[GameState] Loading game state \'" + this.name + "\'...");
    const result = this.onLoad().then((state) => {
      this._isLoaded = true;

      this.emit("load", this);

      return state;
    });

    if (startOnLoad)
    {
      return result.then((state) => {
        console.log("[GameState] Starting game state \'" + this.name + "\'...");
        this.onStart()
      });
    }
    else
    {
      return result;
    }
  }

  update(dt)
  {
    if (!this._isLoaded) throw new Error("Trying to update state that is not yet loaded");

    this.onGameUpdate(dt);

    //Update game state if not suspended
    if (!this._suspended)
    {
      this.onUpdate(dt);
    }

    if (this._nextState !== null)
    {
      this._nextState.update(dt);
    }

    //Load and switch to next game state if available
    if (this._cacheExit)
    {
      console.log("[GameState] Exiting game state \'" + this.name + "\'...");
      this._cacheExit = false;
      this._exitGameState();
    }
    //If trying to add to current state...
    else if (this._cacheNextState !== null)
    {
      console.log("[GameState] Changing game state for \'" + this.name + "\'...");
      const nextState = this._cacheNextState;
      this._cacheNextState = null;
      this._nextGameState(nextState);
    }
  }

  suspend(forNextLoad=false)
  {
    if (!forNextLoad && !this._isLoaded) throw new Error("Trying to suspend state that is not yet initialized");

    //Already suspended, then ignore it...
    if (this._suspended) return;

    console.log("[GameState] Suspending game state \'" + this.name + "\'...");
    this._suspended = true;
    this.onSuspend();
  }

  resume(forNextLoad=false)
  {
    if (!forNextLoad && !this._isLoaded) throw new Error("Trying to resume state that is not yet initialized");

    //Already not suspended, then ignore it...
    if (!this._suspended) return;

    console.log("[GameState] Resuming game state \'" + this.name + "\'...");
    this._suspended = false;
    this.onResume();
  }

  exit(shouldExitChildren=false, immediate=false)
  {
    if (!this._isLoaded) throw new Error("Trying to exit state that is not yet loaded");
    if (!shouldExitChildren && this._nextState !== null) throw new Error("Trying to exit a dependent state");

    if (immediate)
    {
      console.log("[GameState] Exiting game state \'" + this.name + "\'...");
      this._exitGameState();
    }
    else
    {
      this._cacheExit = true;
    }
  }

  nextGameState(gameState)
  {
    if (this._cacheNextState !== null) throw new Error("Trying to set multiple next states");

    if (this.isValidNextGameState(gameState))
    {
      this._cacheNextState = gameState;
      return gameState;
    }
    else
    {
      throw new Error("Invalid next game state");
    }
  }

  getNextGameState()
  {
    return this._nextState;
  }

  getPrevGameState()
  {
    return this._prevState;
  }

  canUpdate()
  {
    return this._isLoaded;
  }

  _nextGameState(nextState)
  {
    return nextState.init(this, false).then((state) => {
      this.suspend();
      this._nextState = state;

      console.log("[GameState] Starting next game state for \'" + this.name + "\'...");
      //Call start after suspending previous state
      nextState.onStart();
    });
  }

  _exitGameState()
  {
    //Trying to exit a dependent state...
    if (this._nextState !== null)
    {
      console.log("[GameState] Exiting child game state for \'" + this.name + "\'...");

      //Exit all children (already updated) first...
      this._nextState._exitGameState();
      this._nextState = null;
    }

    console.log("[GameState] Stopping game state \'" + this.name + "\'...");

    //Continue to exit the state...
    try
    {
      this.onStop();
    }
    catch(e)
    {
      console.error(e);
    }

    if (this._prevState !== null)
    {
      this._prevState._nextState = null;
      this._prevState.resume();
    }

    //If trying to replace current state with next state...
    if (this._cacheNextState !== null)
    {
      if (this._prevState === null) throw new Error("Cannot replace current state while exiting the root state");

      this._prevState.nextGameState(this._cacheNextState);
    }

    this._prevState = null;

    console.log("[GameState] Unloading game state \'" + this.name + "\'...");

    try
    {
      this.onUnload();
    }
    catch(e)
    {
      console.error(e);
    }

    this._isLoaded = false;

    //Suspended is no longer applicable and should be reset (although can be reapplied later)
    this._suspended = false;

    this.emit("unload", this);
  }

  onGameUpdate(dt)
  {

  }

  onLoad()
  {
    return Promise.resolve(this);
  }

  onStart()
  {

  }

  onUpdate(dt)
  {

  }

  onSuspend()
  {

  }

  onResume()
  {

  }

  onStop()
  {

  }

  onUnload()
  {

  }

  isValidNextGameState(gameState)
  {
    return gameState instanceof GameState;
  }
}
Eventable.mixin(GameState);

export default GameState;
