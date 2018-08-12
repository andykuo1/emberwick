import Eventable from 'util/Eventable.js';

class Keyboard
{
  constructor()
  {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    this.registerEvent("down");
    this.registerEvent("up");
  }

  delete()
  {
    this.unregisterEvent("up");
    this.unregisterEvent("down");

    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(e)
  {
    this.emit("down", e);
  }

  onKeyUp(e)
  {
    this.emit("up", e);
  }
}
Eventable.mixin(Keyboard);

export default Keyboard;
