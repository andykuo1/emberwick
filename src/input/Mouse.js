import Eventable from 'util/Eventable.js';

class Mouse
{
  constructor(canvas, allowCursorLock=false)
  {
    this.canvas = canvas;
    this.allowCursorLock = allowCursorLock;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this._down = false;

    canvas.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mousemove", this.onMouseMove, false);

    this.onMouseClick = this.onMouseClick.bind(this);
    canvas.addEventListener("click", this.onMouseClick, false);

    this.registerEvent("move");
    this.registerEvent("down");
    this.registerEvent("up");
  }

  delete()
  {
    if (this.hasPointerLock())
    {
      document.exitPointerLock();
    }

    this.unregisterEvent("move");
    this.unregisterEvent("down");
    this.unregisterEvent("up");

    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);

    this.canvas.removeEventListener("click", this.onMouseClick);
  }

  onMouseClick(e)
  {
    if (this.allowCursorLock)
    {
      this.canvas.requestPointerLock();
    }
  }

  onMouseMove(e)
  {
    if (this.allowCursorLock && !this.hasPointerLock()) return;

    this.emit("move", e);
  }

  onMouseDown(e)
  {
    if (this.allowCursorLock && !this.hasPointerLock()) return;

    if (this._down)
    {
      document.removeEventListener("mouseup", this.onMouseUp);
    }

    this._down = true;
    document.addEventListener("mouseup", this.onMouseUp, false);

    this.emit("down", e);
  }

  onMouseUp(e)
  {
    if (this.allowCursorLock && !this.hasPointerLock()) return;

    document.removeEventListener("mouseup", this.onMouseUp);
    this._down = false;

    this.emit("up", e);
  }

  hasPointerLock()
  {
    return document.pointerLockElement === this.canvas;
  }
}
Eventable.mixin(Mouse);

export default Mouse;
