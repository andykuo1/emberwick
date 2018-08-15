import World from 'world/World.js';
import Renderer from 'world/Renderer.js';

import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import AssetManager from 'assets/AssetManager.js';

const WEBGL_CONTEXT = "webgl";
const CANVAS_ID = "glCanvas";

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;
    this.assets = new AssetManager(window.location + "dist/res/");
    this.renderer = new Renderer(this.assets);
    this.input = new InputManager();
    this.world = new World(this.renderer, this.input, this);

    this.mouse = null;
    this.keyboard = null;
  }

  onLoad(callback)
  {
    this.assets.once("idle", callback);
    this.assets.loadAsset("shader.frag");
    this.assets.loadAsset("shader.vert");
  }

  onUnload()
  {
    this.assets.clear();
  }

  onStart()
  {
    this.canvas = document.getElementById(CANVAS_ID);
    this.gl = this.canvas.getContext(WEBGL_CONTEXT);
    this.renderer.initialize(this.gl);

    this.mouse = new Mouse(this.canvas);
    this.keyboard = new Keyboard();
    this.input.setMouse(this.mouse);
    this.input.setKeyboard(this.keyboard);

    this.world.create();
  }

  onStop()
  {
    this.world.destroy();
    this.keyboard.delete();
    this.mouse.delete();
    this.renderer.terminate(this.gl);
  }

  onUpdate(dt)
  {
    this.input.doInputUpdate();
    this.world.update(dt);

    if (this.gl)
    {
      this.renderer.render(this.gl);
    }
  }
}

export default App;
