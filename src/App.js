import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import AssetManager from 'assets/AssetManager.js';
import SceneManager from 'scene/SceneManager.js';

import GameScene from 'world/example2/GameScene.js';
import GameRenderer from 'world/example2/GameRenderer.js';

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;

    this.assets = new AssetManager(window.location + "res/");
    this.sceneManager = new SceneManager();

    this.renderer = new GameRenderer(this.assets);
    this.input = new InputManager();

    this.mouse = null;
    this.keyboard = null;

    this.sceneManager.setNextScene(new GameScene(this));
  }

  setCanvas(canvas)
  {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
  }

  onLoad(callback)
  {
    this.mouse = new Mouse(this.canvas);
    this.keyboard = new Keyboard();
    this.input.setMouse(this.mouse);
    this.input.setKeyboard(this.keyboard);

    this.renderer.load(this.gl, callback);
  }

  onStart()
  {
    this.sceneManager.update(0);
  }

  onUpdate(dt)
  {
    this.input.doInputUpdate();
    this.sceneManager.update(dt);

    if (this.gl)
    {
      this.sceneManager.render(this.gl);

      const scene = this.sceneManager.getScene();
      if (scene)
      {
        this.renderer.render(this.gl, scene);
      }
    }
  }

  onStop()
  {
    this.sceneManager.destroy();
  }

  onUnload()
  {
    this.sceneManager.unload(this.gl);
    this.keyboard.delete();
    this.mouse.delete();
    this.renderer.unload(this.gl);
    this.assets.clear();
  }
}

export default App;
