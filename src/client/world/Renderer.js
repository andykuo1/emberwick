import Shader from 'render/mogli/Shader.js';
import BufferObject from 'render/mogli/BufferObject.js';
import PerspectiveCamera from 'render/mogli/PerspectiveCamera.js';
import Mesh from 'render/mogli/Mesh.js';
import { mat4, quat } from 'gl-matrix';

import FreeLookCamera from 'render/FreeLookCamera.js';
import SceneNode from 'scenegraph/SceneNode.js';

class Renderer
{
  constructor(assets)
  {
    this.assets = assets;

    this.shader = null;
    this.mesh = null;

    this.camera = null;

    this.sceneGraph = new SceneNode();
  }

  initialize(gl)
  {
    if (gl === null)
    {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      return;
    }

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsh = this.assets.getAsset(this.assets.getAssetLocationByUrl("shader.vert"));
    const fsh = this.assets.getAsset(this.assets.getAssetLocationByUrl("shader.frag"));

    const shader = new Shader(gl, vsh, fsh);
    shader.setLayout("a_position", 3, gl.FLOAT, false);
    shader.setLayout("a_normal", 3, gl.FLOAT, false);
    shader.setLayout("a_texcoord", 2, gl.FLOAT, false);
    this.shader = shader;

    this.mesh = new Mesh(gl, gl.TRIANGLES,
      new Float32Array(cubePositions),
      null,//new Float32Array(cubeTexcoords),
      null,
      new Uint16Array(cubeIndices));

    this.camera = new FreeLookCamera(gl);
    this.camera.position[2] = -6;
  }

  terminate(gl)
  {
    this.shader.delete();
    this.mesh.delete();
  }

  render(gl)
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

    this.mesh.bind(this.shader);
    this.renderScene(gl, this.sceneGraph, viewMatrix);
  }

  renderScene(gl, root, viewMatrix)
  {
    let modelMatrix = mat4.create();
    let nextNodes = [];
    if (root)
    {
      nextNodes.push(root);
    }

    while(nextNodes.length > 0)
    {
      const node = nextNodes.pop();
      if (node.mesh)
      {
        mat4.scale(modelMatrix, node.worldTransform, node.modelScale);

        gl.uniformMatrix4fv(
            this.shader.uniforms.u_model,
            false,
            modelMatrix);

        this.mesh.draw(gl);
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
const cubePositions = [
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

const cubeTexcoords = [
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
const cubeIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

export default Renderer;
