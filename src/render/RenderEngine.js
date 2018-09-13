import Renderer from 'app/Renderer.js';

import RenderTarget from './RenderTarget.js';

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

    this.renderTargets = [];
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

    let sceneGraph, camera, shaderAsset;
    for(const renderTarget of this.renderTargets)
    {
      sceneGraph = renderTarget.getSceneGraph();
      camera = renderTarget.getActiveCamera();
      shaderAsset = renderTarget.getShader();
      this.renderScene(this.gl, sceneGraph, camera, shaderAsset);
    }
  }

  renderScene(gl, sceneGraph, camera, shaderAsset)
  {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const assetManager = this.assetManager;
    const projectionMatrix = camera.getProjectionMatrix();
    const viewMatrix = camera.getViewMatrix();

    const shader = assetManager.getAssetImmediately("shader", shaderAsset) || assetManager.getAssetImmediately("shader", "shader.shader");
    const texture = assetManager.getAssetImmediately("texture", "color.tex");

    gl.useProgram(shader.handle);
    gl.uniformMatrix4fv(
        shader.uniforms.u_projection,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        shader.uniforms.u_view,
        false,
        viewMatrix);
    gl.uniform1i(shader.uniforms.u_sampler, 0);

    texture.bind(gl.TEXTURE0);

    let modelMatrix = mat4.create();
    let normalMatrix = mat4.create();
    let nextNodes = [];
    if (sceneGraph)
    {
      nextNodes.push(sceneGraph);
    }

    const MAX_DEPTH = 100;
    let depth = 0;
    while(nextNodes.length > 0)
    {
      ++depth; if (depth > MAX_DEPTH) break;

      const node = nextNodes.pop();
      const meshID = node.mesh;
      const textureID = node.material;
      if (textureID)
      {
        const texture = assetManager.getAssetImmediately("texture", textureID);
        texture.bind(gl.TEXTURE0);
      }

      if (meshID)
      {
        const mesh = assetManager.getAssetImmediately("mesh", meshID);
        if (mesh)
        {
          mat4.scale(modelMatrix, node.worldTransform, node.modelScale);

          gl.uniformMatrix4fv(
            shader.uniforms.u_model,
            false,
            modelMatrix);

          mat4.mul(normalMatrix, viewMatrix, modelMatrix);
          mat4.invert(normalMatrix, normalMatrix);
          mat4.transpose(normalMatrix, normalMatrix);

          gl.uniformMatrix4fv(
            shader.uniforms.u_normal,
            false,
            normalMatrix
          );

          mesh.bind(shader);
          mesh.draw(gl);
        }
      }

      if (node.isParent())
      {
        const length = node.children.length;
        for(let i = length - 1; i >= 0; --i)
        {
          nextNodes.push(node.children[i]);
        }
      }
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
