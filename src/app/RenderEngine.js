import AssetManager from 'assets/pigeon/AssetManager.js';

import TextLoader from 'assets/pigeon/loaders/TextLoader.js';
import ImageLoader from 'assets/pigeon/loaders/ImageLoader.js';
import OBJLoader from 'assets/pigeon/loaders/OBJLoader.js';
import MeshLoader from 'assets/pigeon/loaders/MeshLoader.js';
import ShaderLoader from 'assets/pigeon/loaders/ShaderLoader.js';
import TextureLoader from 'assets/pigeon/loaders/TextureLoader.js';
import InputMappingLoader from 'assets/pigeon/loaders/InputMappingLoader.js';

class RenderEngine
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.gl = null;

    this.assetManager = new AssetManager();
  }

  initialize()
  {
    const gl = this.canvas.getContext('webgl');
    this.gl = gl;

    const assets = this.assetManager;
    const assetDir = window.location + "res/";
    assets.registerAssetLoader("vert", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("frag", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("image", new ImageLoader(assets, assetDir));
    assets.registerAssetLoader("obj", new OBJLoader(assets, assetDir));

    assets.registerAssetLoader("mesh", new MeshLoader(assets, gl));
    assets.registerAssetLoader("shader", new ShaderLoader(assets, gl));
    assets.registerAssetLoader("texture", new TextureLoader(assets, gl));

    assets.registerAssetLoader("inputmap", new InputMappingLoader(assets, assetDir));

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    return Promise.resolve();
  }

  terminate()
  {
    this.assetManager.clear();
    this.gl = null;
  }

  getAssetManager()
  {
    return this.assetManager;
  }

  getCanvas()
  {
    return this.canvas;
  }

  getGLContext()
  {
    return this.gl;
  }
}

export default RenderEngine;
