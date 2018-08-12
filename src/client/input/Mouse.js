import Eventable from 'util/Eventable.js';

class Mouse
{
  constructor(canvas)
  {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    document.addEventListener("mousemove", this.onMouseMove, false);
    document.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mouseup", this.onMouseUp, false);

    this.onMouseClick = this.onMouseClick.bind(this);
    canvas.addEventListener("click", this.onMouseClick, false);
    this.canvas = canvas;

    this.registerEvent("move");
    this.registerEvent("down");
    this.registerEvent("up");
  }

  delete()
  {
    this.unregisterEvent("move");
    this.unregisterEvent("down");
    this.unregisterEvent("up");

    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);

    this.canvas.removeEventListener("click", this.onMouseClick);
  }

  onMouseClick(e)
  {
    this.canvas.requestPointerLock();
  }

  onMouseMove(e)
  {
    this.emit("move", e);
  }

  onMouseDown(e)
  {
    this.emit("down", e);
  }

  onMouseUp(e)
  {
    this.emit("up", e);
  }

  hasPointerLock()
  {
    return document.pointerLockElement === this.canvas;
  }
}
Eventable.mixin(Mouse);

export default Mouse;
