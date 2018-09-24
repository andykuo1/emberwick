class ViewPort
{
  constructor(canvas, x=0, y=0, width=0, height=0)
  {
    this._canvas = canvas;

    this.x = x;
    this.y = y;
    this._width = width;
    this._height = height;
  }

  update(gl)
  {
    gl.viewport(this.x, this.y, this.getWidth(), this.getHeight());
  }

  getWidth()
  {
    return this._width > 0 ? this._width : this._canvas.clientWidth;
  }

  getHeight()
  {
    return this._height > 0 ? this._height : this._canvas.clientHeight;
  }

  getAspectRatio()
  {
    return this.getWidth() / this.getHeight();
  }

  getCanvas()
  {
    return this._canvas;
  }
}

export default ViewPort;
