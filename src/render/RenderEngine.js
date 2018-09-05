import GameState from 'gamestate/GameState.js';

import { mat4, quat } from 'gl-matrix';
import AssetManager from 'assets/pigeon/AssetManager.js';

import TextLoader from 'assets/pigeon/loaders/TextLoader.js';
import ImageLoader from 'assets/pigeon/loaders/ImageLoader.js';
import OBJLoader from 'assets/pigeon/loaders/OBJLoader.js';
import MeshLoader from 'assets/pigeon/loaders/MeshLoader.js';
import ShaderLoader from 'assets/pigeon/loaders/ShaderLoader.js';
import TextureLoader from 'assets/pigeon/loaders/TextureLoader.js';

class RenderEngine extends GameState
{
  constructor(canvas)
  {
    super("RenderEngine");

    this.canvas = canvas;
    this.gl = null;

    this.assetManager = null;

    this.renderTargets = [];
  }

  //Override
  onLoad()
  {
    const gl = this.canvas.getContext('webgl');
    this.gl = gl;

    const assets = new AssetManager();
    const assetDir = window.location + "res/";
    assets.registerAssetLoader("vert", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("frag", new TextLoader(assets, assetDir));
    assets.registerAssetLoader("image", new ImageLoader(assets, assetDir));
    assets.registerAssetLoader("obj", new OBJLoader(assets, assetDir));

    assets.registerAssetLoader("mesh", new MeshLoader(assets, gl));
    assets.registerAssetLoader("shader", new ShaderLoader(assets, gl));
    assets.registerAssetLoader("texture", new TextureLoader(assets, gl));
    this.assetManager = assets;

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    return super.onLoad()
      .then(assets.loadAsset("image", "color.png"))
      .then(assets.loadAsset("texture", "color.tex", {image: "color.png"}));
  }

  //Override
  onChangeState(nextState, prevState)
  {
    //Do not suspend on state change
  }

  //Override
  onUpdate(dt)
  {
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

    const shader = assetManager.getAssetImmediately("shader", shaderAsset);
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
      if (meshID)
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

        const mesh = assetManager.getAssetImmediately("mesh", meshID);
        mesh.bind(shader);
        mesh.draw(gl);
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

  //Override
  onUnload()
  {
    this.renderTargets.length = 0;

    this.texture.delete();
    this.shader.delete();

    this.assetManager.clear();
    this.gl = null;
  }

  addRenderTarget(renderTarget)
  {
    const assets = renderTarget.getAssetManifest();
    return this.assetManager.loadManifest(assets).then(() => {
      this.renderTargets.push(renderTarget);
    });
  }

  removeRenderTarget(renderTarget)
  {
    this.renderTargets.splice(this.renderTargets.indexOf(renderTarget), 1);
  }
}

export default RenderEngine;
