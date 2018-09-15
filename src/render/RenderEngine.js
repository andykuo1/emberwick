import Renderer from 'app/Renderer.js';

import RenderTarget from './RenderTarget.js';
import SceneGraphRenderer from './SceneGraphRenderer.js';

import { mat4, quat } from 'gl-matrix';

import AssetManager from 'assets/pigeon/AssetManager.js';
import TextLoader from 'assets/pigeon/loaders/TextLoader.js';
import ImageLoader from 'assets/pigeon/loaders/ImageLoader.js';
import OBJLoader from 'assets/pigeon/loaders/OBJLoader.js';
import MeshLoader from 'assets/pigeon/loaders/MeshLoader.js';
import ShaderLoader from 'assets/pigeon/loaders/ShaderLoader.js';
import TextureLoader from 'assets/pigeon/loaders/TextureLoader.js';

class RenderEngine extends Renderer
{
  constructor(canvas)
  {
    super();

    this.canvas = canvas;
    this.gl = null;

    this.assetManager = new AssetManager();

    this.sceneGraphRenderer = new SceneGraphRenderer(this.assetManager);

    this.renderTargets = [];
    this.renderers = [];
  }

  addRenderer(renderer)
  {
    return renderer.load(this).then(() => this.renderers.push(renderer));
  }

  removeRenderer(renderer)
  {
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
    renderer.unload();
  }

  createRenderTarget()
  {
    const result = new RenderTarget(this);
    this.renderTargets.push(result);
    return result;
  }

  destroyRenderTarget(renderTarget)
  {
    this.renderTargets.splice(this.renderTargets.indexOf(renderTarget), 1);
  }

  //Override
  load()
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

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    return super.load()
    .then(() => Promise.all([
      assets.loadAsset("vert", "shader.vert"),
      assets.loadAsset("frag", "shader.frag"),
      assets.loadAsset("shader", "shader.shader", {vertexShader: "shader.vert", fragmentShader: "shader.frag"}),
      assets.loadAsset("image", "color.png"),
      assets.loadAsset("texture", "color.tex", {image: "color.png"}),
      assets.loadAsset("image", "rock.jpg"),
      assets.loadAsset("texture", "rock.tex", {image: "rock.jpg"})
    ]));
  }

  //Override
  unload()
  {
    super.unload();

    this.assetManager.clear();
    this.gl = null;
  }

  //Override
  update()
  {
    super.update();

    for(const renderer of this.renderers)
    {
      renderer.update();
    }

    let sceneGraph, camera, shaderAsset;
    for(const renderTarget of this.renderTargets)
    {
      sceneGraph = renderTarget.getSceneGraph();
      camera = renderTarget.getActiveCamera();
      this.sceneGraphRenderer.render(this.gl, sceneGraph, camera);
    }
  }

  getAssetManager()
  {
    return this.assetManager;
  }

  getCanvas()
  {
    return this.canvas;
  }
}

export default RenderEngine;
