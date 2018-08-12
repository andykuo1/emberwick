import World from 'world/World.js';
import Renderer from 'world/Renderer.js';
import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';

const WEBGL_CONTEXT = "webgl";
const CANVAS_ID = "glCanvas";

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
    this.renderer = new Renderer();
    this.world = new World(this.renderer, this);

    this.mouse = null;
    this.keyboard = null;
  }

  onLoad()
  {
    this.canvas = document.getElementById(CANVAS_ID);
    this.gl = this.canvas.getContext(WEBGL_CONTEXT);
    this.renderer.initialize(this.gl);
    this.mouse = new Mouse(this.canvas);
    this.keyboard = new Keyboard();
    this.world.create();
  }

  onUnload()
  {
    this.world.destroy();
    this.keyboard.delete();
    this.mouse.delete();
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
