import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import AssetManager from 'assets/AssetManager.js';
import SceneManager from 'scene/SceneManager.js';

import GameWorld from 'world/example/GameWorld.js';
import Renderer from 'world/example/Renderer.js';

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;

    this.assets = new AssetManager(window.location + "res/");
    this.sceneManager = new SceneManager();

    this.renderer = new Renderer(this.assets);
    this.input = new InputManager();

    this.mouse = null;
    this.keyboard = null;

    this.sceneManager.setNextScene(new GameWorld(this));
  }

  setCanvas(canvas)
  {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
  }

  onLoad(callback)
  {
    this.assets.once("idle", () => {
      this.renderer.initialize(this.gl);

      this.mouse = new Mouse(this.canvas);
      this.keyboard = new Keyboard();
      this.input.setMouse(this.mouse);
      this.input.setKeyboard(this.keyboard);

      this.sceneManager.render(this.gl);

      callback();
    });

    this.assets.loadAsset("shader.vert");
    this.assets.loadAsset("shader.frag");
    this.assets.loadAsset("phong.vert");
    this.assets.loadAsset("phong.frag");
    this.assets.loadAsset("color.png");
    this.assets.loadAsset("capsule.jpg");
    this.assets.loadAsset("cube.obj");
    this.assets.loadAsset("capsule.obj");
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

      this.renderer.render(this.gl);

      const scene = this.sceneManager.getScene();
      if (scene)
      {
        this.renderer.renderScene(this.gl, scene.getSceneGraph());
      }
    }
  }

  onStop()
  {
    this.sceneManager.destroy();
    this.keyboard.delete();
    this.mouse.delete();
    this.renderer.terminate(this.gl);
  }

  onUnload()
  {
    this.sceneManager.unload();
    this.assets.clear();
  }
}

export default App;
