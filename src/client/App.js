import Renderer from './render/Renderer.js';

const WEBGL_CONTEXT = "webgl";
const CANVAS_ID = "glCanvas";

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
    this.renderer = new Renderer();
  }

  onLoad()
  {
    this.canvas = document.getElementById(CANVAS_ID);
    this.gl = this.canvas.getContext(WEBGL_CONTEXT);

    this.renderer.initialize(this.gl);
  }

  onUnload()
  {
    this.renderer.terminate(this.gl);
  }

  onUpdate(dt)
  {
    this.renderer.update(dt);
    
    if (this.gl)
    {
      this.renderer.render(this.gl);
    }
  }
}

export default App;
