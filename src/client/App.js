import World from 'world/World.js';
import Renderer from 'world/Renderer.js';

const WEBGL_CONTEXT = "webgl";
const CANVAS_ID = "glCanvas";

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
    this.renderer = new Renderer();
    this.world = new World(this.renderer);
  }

  onLoad()
  {
    this.canvas = document.getElementById(CANVAS_ID);
    this.gl = this.canvas.getContext(WEBGL_CONTEXT);

    this.renderer.initialize(this.gl);
    this.world.create();
  }

  onUnload()
  {
    this.world.destroy();
    this.renderer.terminate(this.gl);
  }

  onUpdate(dt)
  {
    this.world.update(dt);

    if (this.gl)
    {
      this.renderer.render(this.gl);
    }
  }
}

export default App;
