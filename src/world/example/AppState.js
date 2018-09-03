import GameState from 'app/GameState.js';
import * as App from 'app/App.js';

import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import AssetManager from 'assets/pigeon/AssetManager.js';
import EntityManager from 'ecs/EntityManager.js';

import TextLoader from 'assets/pigeon/loaders/TextLoader.js';
import ImageLoader from 'assets/pigeon/loaders/ImageLoader.js';
import MeshLoader from 'assets/pigeon/loaders/MeshLoader.js';
import OBJLoader from 'assets/pigeon/loaders/OBJLoader.js';

class AppState extends GameState
{
  constructor()
  {
    super("App");

    this.canvas = null;
    this.gl = null;

    this.assets = null;
    this.entityManager = null;
    this.inputManager = null;
    this.mouse = null;
    this.keyboard = null;
    this.renderer = null;
  }

  //Override
  onLoad()
  {
    const canvas = this.canvas = App.INSTANCE.canvas;
    const gl = this.gl = App.INSTANCE.gl;

    const assets = new AssetManager();
    const assetDir = window.location + "res/";
    assets.registerAssetLoader("vert", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("frag", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("image", new ImageLoader(assets, assetDir));
    assets.registerAssetLoader("obj", new OBJLoader(assets, assetDir));

    assets.registerAssetLoader("mesh", new MeshLoader(assets, gl));
    this.assets = assets;

    this.entityManager = new EntityManager();
    this.inputManager = new InputManager();
    this.mouse = new Mouse(canvas);
    this.keyboard = new Keyboard();
    this.inputManager.setMouse(this.mouse);
    this.inputManager.setKeyboard(this.keyboard);

    return super.onLoad();
  }

  //Override
  onStart() {}

  //Override
  onUpdate(dt) {}

  //Override
  onSuspend() {}

  //Override
  onResume() {}

  //Override
  onStop() {}

  //Override
  onUnload()
  {
    this.keyboard.delete();
    this.mouse.delete();
    this.assets.clear();
  }
}

export default AppState;
