import Shader from './mogli/Shader.js';
import BufferObject from './mogli/BufferObject.js';
import PerspectiveCamera from './mogli/PerspectiveCamera.js';
import Mesh from './mogli/Mesh.js';
import { mat4 } from 'gl-matrix';

const vsh = `
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_modelview;
uniform mat4 u_projection;

varying highp vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_modelview * a_position;
  v_texcoord = a_texcoord;
}
`;
const fsh = `
varying highp vec2 v_texcoord;

uniform sampler2D u_sampler;

void main() {
  gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`;
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

class Renderer
{
  constructor()
  {
    this.shader = null;

    this.mesh = null;

    this.rotation = 0;

    this.camera = null;
    this.chunkManager = null;
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

    const shader = new Shader(gl, vsh, fsh);
    this.shader = shader;

    this.mesh = new Mesh(gl, gl.TRIANGLES,
      new Float32Array(cubePositions),
      null,
      //new Float32Array(cubeTexcoords),
      null,
      new Uint16Array(cubeIndices));

    this.camera = new PerspectiveCamera(gl);
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

    this.rotation += 0.01;

    const projectionMatrix = this.camera.getProjectionMatrix();
    const modelViewMatrix = this.camera.getViewMatrix();
    mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotation * .7, [0, 1, 1]);

    this.mesh.bind(this.shader);

    // Tell WebGL to use our program when drawing
    gl.useProgram(this.shader.handle);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        this.shader.uniforms.u_projection,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        this.shader.uniforms.u_modelview,
        false,
        modelViewMatrix);

    this.mesh.draw(gl, 0);
  }
}

export default Renderer;
