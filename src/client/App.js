import World from 'world/World.js';

const WEBGL_CONTEXT = "webgl";
const CANVAS_ID = "glCanvas";

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
    this.world = new World();
  }

  onLoad()
  {
    this.canvas = document.getElementById(CANVAS_ID);
    this.gl = this.canvas.getContext(WEBGL_CONTEXT);

    this.world.renderer.initialize(this.gl);
  }

  onUnload()
  {
    this.world.renderer.terminate(this.gl);
  }

  onUpdate(dt)
  {
    this.world.update(dt);

    if (this.gl)
    {
      this.world.render(this.gl);
    }
  }
}

export default App;
