import Eventable from 'util/Eventable.js';

export const FRAMES_PER_SECOND = 60;

class GameLoop
{
  constructor()
  {
    this._running = false;

    this.dt = 0;
    this.prevtime = 0;

    this.registerEvent("update");

    this.onWindowUpdate = this.onWindowUpdate.bind(this);
  }

  start()
  {
    if (this._running) return;

    //Start the application update loop
    this._running = true;
    window.requestAnimationFrame(this.onWindowUpdate);
  }

  stop()
  {
    if (!this._running) return;

    //Stop any future updates
    this._running = false;
  }

  onWindowUpdate(time)
  {
    if (this._running)
    {
      this.dt = time - this.prevtime;

      this.emit("update", this.dt / FRAMES_PER_SECOND, this.dt);

      this.prevtime = time;

      //Continue the application update loop
      window.requestAnimationFrame(this.onWindowUpdate);
    }
  }
}
Eventable.mixin(GameLoop);

export default GameLoop;
