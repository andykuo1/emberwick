import GameState from 'gamestate/GameState.js';
import PlayableGameState from './PlayableGameState.js';

import * as App from 'app/App.js';

import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import EntityManager from 'ecs/EntityManager.js';

import Mesh from 'render/mogli/Mesh.js';

class GameStartState extends GameState
{
  constructor()
  {
    super();

    this.canvas = null;
    this.gl = null;
    this.assets = null;

    this.renderTarget = null;

    this.entityManager = null;
    this.inputManager = null;

    this.mouse = null;
    this.keyboard = null;
  }

  //Override
  onLoad(renderer)
  {
    const renderTarget = renderer.createRenderTarget();
    this.renderTarget = renderTarget;

    const manifest = renderTarget.getAssetManifest();

    manifest.addAsset("vert", "phong.vert");
    manifest.addAsset("frag", "phong.frag");

    manifest.addAsset("image", "capsule.jpg");
    manifest.addAsset("obj", "cube.obj");
    manifest.addAsset("obj", "capsule.obj");
    manifest.addAsset("obj", "quad.obj");

    manifest.addAsset("shader", "phong.shader", {vertexShader: "phong.vert", fragmentShader: "phong.frag"});
    manifest.addAsset("mesh", "capsule.mesh", {geometry: "capsule.obj"});
    manifest.addAsset("mesh", "quad.mesh", {geometry: "quad.obj"});

    return super.onLoad(renderer)
    .then(() => renderer.getAssetManager().loadManifest(manifest))
    .then(() => {
      const assets = renderer.getAssetManager();
      const canvas = renderer.getCanvas();
      const gl = renderer.gl;

      this.entityManager = new EntityManager();
      this.inputManager = new InputManager();

      this.mouse = new Mouse(canvas);
      this.keyboard = new Keyboard();
      this.inputManager.setMouse(this.mouse);
      this.inputManager.setKeyboard(this.keyboard);

      //Load mesh through cache
      assets.cacheAsset("mesh", "cube.mesh", new Mesh(gl, gl.TRIANGLES,
        new Float32Array(defaultPositions),
        new Float32Array(defaultTexcoords),
        new Float32Array(defaultNormals),
        new Uint16Array(defaultIndices)));
    });
  }

  //Override
  onChangeState(nextState, prevState)
  {
    //Do not suspend on state change
  }

  //Override
  onStart() {}

  //Override
  onUpdate(dt)
  {
    this.inputManager.doInputUpdate();
    this.entityManager.update(dt);
  }

  //Override
  onSuspend() {}

  //Override
  onResume() {}

  //Override
  onStop() {}

  //Override
  onUnload(renderer)
  {
    this.entityManager.clear();

    renderer.destroyRenderTarget(this.renderTarget);

    this.keyboard.delete();
    this.mouse.delete();
  }

  //Override
  isValidNextGameState(gameState)
  {
    return super.isValidNextGameState(gameState) && gameState instanceof PlayableGameState;
  }
}

export default GameStartState;


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
