import Eventable from 'util/Eventable.js';

class GameState
{
  constructor()
  {
    this._opts = null;

    this._prevState = null;
    this._nextState = null;

    this._cacheNextState = null;
    this._cacheNextOpts = null;
    this._cacheExit = false;

    this._isLoaded = false;
    this._suspended = false;

    this.registerEvent("load");
    this.registerEvent("unload");
  }

  init(opts=null, prevState=null, startOnLoad=true)
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
    console.log("[GameState] Loading game state \'" + this.constructor.name + "\'...");

    const result = this.onLoad(opts).then(() => {
      this._opts = opts;
      this._isLoaded = true;

      this.emit("load", this);
    });

    if (startOnLoad)
    {
      return result.then(() => {
        console.log("[GameState] Starting game state \'" + this.constructor.name + "\'...");
        this.onStart(opts);
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

    //Update game state if not suspended
    if (!this._suspended)
    {
      this.onUpdate(dt);
    }

    if (this._nextState !== null)
    {
      this._nextState.update(dt);
    }

    this.onUpdateState(dt);

    //Load and switch to next game state if available
    if (this._cacheExit)
    {
      console.log("[GameState] Exiting game state \'" + this.constructor.name + "\'...");
      this._cacheExit = false;
      this.exitImmediately();
    }
    //If trying to add to current state...
    else if (this._cacheNextState !== null)
    {
      console.log("[GameState] Changing game state for \'" + this.constructor.name + "\'...");
      const nextState = this._cacheNextState;
      const nextOpts = this._cacheNextOpts || this._opts;
      this._cacheNextState = null;
      this._cacheNextOpts = null;
      this._nextGameState(nextState, nextOpts);
    }
  }

  suspend(forNextLoad=false)
  {
    if (!forNextLoad && !this._isLoaded) throw new Error("Trying to suspend state that is not yet initialized");

    //Already suspended, then ignore it...
    if (this._suspended) return;

    console.log("[GameState] ...suspending game state \'" + this.constructor.name + "\'...");
    this._suspended = true;
    this.onSuspend();
  }

  resume(forNextLoad=false)
  {
    if (!forNextLoad && !this._isLoaded) throw new Error("Trying to resume state that is not yet initialized");

    //Already not suspended, then ignore it...
    if (!this._suspended) return;

    console.log("[GameState] ...resuming game state \'" + this.constructor.name + "\'...");
    this._suspended = false;
    this.onResume();
  }

  exit(shouldExitChildren=false)
  {
    if (!this._isLoaded) throw new Error("Trying to exit state that is not yet loaded");
    if (!shouldExitChildren && this._nextState !== null) throw new Error("Trying to exit a dependent state");

    this._cacheExit = true;
  }

  exitImmediately()
  {
    //Trying to exit a dependent state...
    if (this._nextState !== null)
    {
      console.log("[GameState] Exiting child game state for \'" + this.constructor.name + "\'...");

      //Exit all children (already updated) first...
      this._nextState.exitImmediately();
      this._nextState = null;
    }

    console.log("[GameState] Stopping game state \'" + this.constructor.name + "\'...");

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
      this._prevState.onChangeState(this._prevState, this);
    }

    //If trying to replace current state with next state...
    if (this._cacheNextState !== null)
    {
      if (this._prevState === null) throw new Error("Cannot replace current state while exiting the root state");
      const nextState = this._cacheNextState;
      const nextOpts = this._cacheNextOpts;
      this._cacheNextState = null;
      this._cacheNextOpts = null;
      this._prevState.nextGameState(nextState, nextOpts);
    }

    this._prevState = null;

    console.log("[GameState] Unloading game state \'" + this.constructor.name + "\'...");

    try
    {
      this.onUnload(this._opts);
    }
    catch(e)
    {
      console.error(e);
    }

    this._isLoaded = false;
    this._opts = null;

    //Suspended is no longer applicable and should be reset (although can be reapplied later)
    this._suspended = false;

    this.emit("unload", this);
  }

  nextGameState(gameState, opts=null)
  {
    if (this._cacheNextState !== null) throw new Error("Trying to set multiple next states");

    if (this.isValidNextGameState(gameState))
    {
      this._cacheNextState = gameState;
      this._cacheNextOpts = opts;
      return gameState;
    }
    else
    {
      throw new Error("Invalid next game state");
    }
  }

  //WARNING: Deprecated
  getNextGameState()
  {
    return this._nextState;
  }

  //WARNING: Deprecated
  getPrevGameState()
  {
    return this._prevState;
  }

  canUpdate()
  {
    return this._isLoaded;
  }

  _nextGameState(nextState, opts)
  {
    return nextState.init(opts, this, false).then(() => {
      this._nextState = nextState;
      this.onChangeState(nextState, this);

      console.log("[GameState] Starting next game state for \'" + this.constructor.name + "\'...");
      //Call start after suspending previous state
      nextState.onStart(opts);
    });
  }

  onUpdateState(dt) {}

  onChangeState(nextState, prevState)
  {
    console.log("[GameState] Changing state from \'" + prevState.constructor.name + "\' to \'" + nextState.constructor.name + "\'...");

    if (nextState !== this)
    {
      this.suspend();
    }
    else
    {
      this.resume();
    }
  }

  onLoad(opts) { return Promise.resolve(); }

  onStart(opts) {}

  onUpdate(dt) {}

  onSuspend() {}

  onResume() {}

  onStop(opts) {}

  onUnload(opts) {}

  isValidNextGameState(gameState)
  {
    return gameState instanceof GameState;
  }

  isSuspended()
  {
    return this._suspended;
  }
}
Eventable.mixin(GameState);

export default GameState;
