import GameState from 'gamestate/GameState.js';

import AssetManager from 'assets/pigeon/AssetManager.js';

import TextLoader from 'assets/pigeon/loaders/TextLoader.js';
import ImageLoader from 'assets/pigeon/loaders/ImageLoader.js';
import OBJLoader from 'assets/pigeon/loaders/OBJLoader.js';
import MeshLoader from 'assets/pigeon/loaders/MeshLoader.js';

class RenderEngine extends GameState
{
  constructor(canvas)
  {
    super();

    this.canvas = canvas;
    this.gl = null;

    this.assetManager = null;
  }

  //Override
  onLoad()
  {
    this.gl = this.canvas.getContext('webgl');

    const assets = new AssetManager();
    const assetDir = window.location + "res/";
    assets.registerAssetLoader("vert", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("frag", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("image", new ImageLoader(assets, assetDir));
    assets.registerAssetLoader("obj", new OBJLoader(assets, assetDir));

    assets.registerAssetLoader("mesh", new MeshLoader(assets, this.gl));
    this.assetManager = assets;

    return super.onLoad();
  }

  //Override
  onChangeState(nextState, prevState) {}

  //Override
  onUpdate(dt)
  {

  }

  //Override
  onUnload()
  {
    this.assetManager.clear();
    this.gl = null;
  }
}

export default RenderEngine;
