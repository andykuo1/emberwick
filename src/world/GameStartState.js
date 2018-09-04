import GameState from 'gamestate/GameState.js';
import PlayableGameState from './PlayableGameState.js';

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

import GameRenderer from 'world/GameRenderer.js';

class GameStartState extends GameState
{
  constructor()
  {
    super("GameStart");

    this.canvas = null;
    this.gl = null;

    this.renderer = null;

    this.assets = null;
    this.entityManager = null;
    this.inputManager = null;

    this.mouse = null;
    this.keyboard = null;
  }

  //Override
  onLoad()
  {
    const assets = new AssetManager();
    const assetDir = window.location + "res/";
    assets.registerAssetLoader("vert", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("frag", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("image", new ImageLoader(assets, assetDir));
    assets.registerAssetLoader("obj", new OBJLoader(assets, assetDir));
    this.assets = assets;

    this.entityManager = new EntityManager();
    this.inputManager = new InputManager();

    const canvas = this.canvas = App.INSTANCE.canvas;
    const gl = this.gl = App.INSTANCE.gl;

    assets.registerAssetLoader("mesh", new MeshLoader(assets, gl));
    this.mouse = new Mouse(canvas);
    this.keyboard = new Keyboard();
    this.inputManager.setMouse(this.mouse);
    this.inputManager.setKeyboard(this.keyboard);

    this.renderer = new GameRenderer(assets);

    return new Promise((resolve, reject) => {
      this.renderer.load(gl, () => resolve(this));
    });
  }

  //Override
  onStart() {}

  //Override
  onGameUpdate(dt)
  {
    this.inputManager.doInputUpdate();

    this.entityManager.update(dt);

    const gameState = this.getNextGameState();
    if (gameState)
    {
      this.renderer.render(this.gl, gameState);
    }
  }

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
    this.renderer.unload(this.gl);
    this.keyboard.delete();
    this.mouse.delete();
    this.assets.clear();
  }

  //Override
  isValidNextGameState(gameState)
  {
    return super.isValidNextGameState(gameState) && gameState instanceof PlayableGameState;
  }
}

export default GameStartState;
