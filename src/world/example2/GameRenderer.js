import { mat4, quat } from 'gl-matrix';
import Shader from 'render/mogli/Shader.js';
import BufferObject from 'render/mogli/BufferObject.js';
import Mesh from 'render/mogli/Mesh.js';
import Texture from 'render/mogli/Texture.js';
import Renderer from 'render/Renderer.js';

import AssetManifest from 'assets/pigeon/AssetManifest.js';

import FreeLookCamera from 'render/camera/FreeLookCamera.js';

class RenderExample extends Renderer
{
  constructor(assets)
  {
    super();

    this.assets = assets;

    this.shader = null;
    this.mesh = null;
    this.cube = null;

    this.camera = null;
  }

  //Override
  load(gl, callback)
  {
    if (gl === null)
    {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      return;
    }

    const manifest = new AssetManifest();
    this.onPrepareAssets(manifest);
    this.assets.loadManifest(manifest).then(() => {
      this.onRenderInit(gl);
      callback();
    });
  }

  //Override
  unload(gl)
  {
    this.texture.delete();
    this.shader.delete();
  }

  onPrepareAssets(manifest)
  {
    manifest.addAsset("vert", "shader.vert");
    manifest.addAsset("frag", "shader.frag");

    manifest.addAsset("vert", "phong.vert");
    manifest.addAsset("frag", "phong.frag");

    manifest.addAsset("image", "color.png");
    manifest.addAsset("image", "capsule.jpg");
    manifest.addAsset("obj", "cube.obj");
    manifest.addAsset("obj", "capsule.obj");
    manifest.addAsset("obj", "quad.obj");
  }

  onRenderInit(gl)
  {
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const assets = this.assets;

    //Load shaders
    const shader = new Shader(gl,
      assets.getAssetImmediately("vert", "phong.vert"),
      assets.getAssetImmediately("frag","phong.frag"));
    shader.setLayout("a_position", 3, gl.FLOAT, false);
    shader.setLayout("a_texcoord", 2, gl.FLOAT, false);
    shader.setLayout("a_normal", 3, gl.FLOAT, false);
    this.shader = shader;

    //Load textures
    this.texture = new Texture(gl);
    this.texture.bindData(assets.getAssetImmediately("image", "color.png"));

    //Setup camera
    this.camera = new FreeLookCamera(gl);
    this.camera.position[2] = -60;

    //Load mesh through assets
    assets.loadAsset("mesh", "capsule.mesh", { geometry: "capsule.obj" });
    assets.loadAsset("mesh", "quad.mesh", { geometry: "quad.obj" });

    //Load mesh through cache
    assets.cacheAsset("mesh", "cube.mesh", new Mesh(gl, gl.TRIANGLES,
      new Float32Array(defaultPositions),
      new Float32Array(defaultTexcoords),
      new Float32Array(defaultNormals),
      new Uint16Array(defaultIndices)));
  }

  //Override
  render(gl, scene)
  {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = this.camera.getProjectionMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    gl.useProgram(this.shader.handle);
    gl.uniformMatrix4fv(
        this.shader.uniforms.u_projection,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        this.shader.uniforms.u_view,
        false,
        viewMatrix);
    gl.uniform1i(this.shader.uniforms.u_sampler, 0);

    this.texture.bind(gl.TEXTURE0);
    this.renderScene(gl, scene.getSceneGraph());
  }

  renderScene(gl, root)
  {
    const viewMatrix = this.camera.getViewMatrix();
    let modelMatrix = mat4.create();
    let normalMatrix = mat4.create();
    let nextNodes = [];
    if (root)
    {
      nextNodes.push(root);
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
          this.shader.uniforms.u_model,
          false,
          modelMatrix);

        mat4.mul(normalMatrix, viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(
          this.shader.uniforms.u_normal,
          false,
          normalMatrix
        );

        const mesh = this.assets.getAssetImmediately("mesh", meshID);
        mesh.bind(this.shader);
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
}

const square = [
  -1,  1,
   1,  1,
  -1, -1,
   1, -1
];

const defaultPositions = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];
const defaultTexcoords = [
  // Front
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Back
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Top
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Bottom
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Right
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Left
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
];
const defaultNormals = [
  // Front
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,

  // Back
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,

  // Top
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,

  // Bottom
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,

  // Right
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,

  // Left
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0
];
const defaultIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

export default RenderExample;
