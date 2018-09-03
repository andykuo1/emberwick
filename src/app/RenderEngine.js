class RenderEngine
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
  }

  load(canvas, gl)
  {
    if (gl === null)
    {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      return;
    }

    this.canvas = canvas;
    this.gl = gl;

    return Promise.resolve();
  }

  update()
  {

  }

  unload()
  {

  }
}

export default RenderEngine;
