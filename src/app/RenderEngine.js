class RenderEngine
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
  }

  load(canvas, gl)
  {
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
