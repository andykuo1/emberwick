import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import AssetManager from 'assets/pigeon/AssetManager.js';
import SceneManager from 'scene/SceneManager.js';
import EntityManager from 'ecs/EntityManager.js';

import GameScene from 'world/example/GameScene.js';
import GameRenderer from 'world/example/GameRenderer.js';

import TextLoader from 'assets/pigeon/loaders/TextLoader.js';
import ImageLoader from 'assets/pigeon/loaders/ImageLoader.js';
import MeshLoader from 'assets/pigeon/loaders/MeshLoader.js';
import OBJLoader from 'assets/pigeon/loaders/OBJLoader.js';

class App
{
  constructor()
  {
    this.canvas = null;
    this.gl = null;

    this.assets = new AssetManager();
    const assetDir = window.location + "res/";
    this.assets.registerAssetLoader("vert", new TextLoader(this.assets, assetDir));
    this.assets.registerAssetLoader("frag", new TextLoader(this.assets, assetDir));
    this.assets.registerAssetLoader("image", new ImageLoader(this.assets, assetDir));
    this.assets.registerAssetLoader("obj", new OBJLoader(this.assets, assetDir));
    this.assets.registerAssetLoader("mesh", new MeshLoader(this.assets));

    this.sceneManager = new SceneManager();

    this.entityManager = new EntityManager();

    this.input = new InputManager();
    this.mouse = null;
    this.keyboard = null;

    this.renderer = new GameRenderer(this.assets);
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
