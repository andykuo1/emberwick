import * as App from 'app/App.js';
import GameState from 'app/GameState.js';

import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import EntityManager from 'ecs/EntityManager.js';

import SceneNode from 'scenegraph/SceneNode.js';
import InputContext from 'input/context/InputContext.js';

import * as InputCodes from 'input/InputCodes.js';
import ActionInput from 'input/context/ActionInput.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

import Mesh from 'render/mogli/Mesh.js';

class GameStartState extends GameState
{
  constructor()
  {
    super();

    this.renderTarget = null;
    this.sceneGraph = null;

    this.entityManager = new EntityManager();
    this.inputManager = null;
    this.inputContext = null;

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  //Override
  onLoad(renderer)
  {
    const renderTarget = renderer.createRenderTarget();
    const manifest = renderTarget.getAssetManifest();
    this.renderTarget = renderTarget;

    manifest.addAsset("vert", "phong.vert");
    manifest.addAsset("frag", "phong.frag");

    manifest.addAsset("image", "capsule.jpg");
    manifest.addAsset("texture", "capsule.tex", {image: "capsule.jpg"}),
    manifest.addAsset("obj", "cube.obj");
    manifest.addAsset("obj", "capsule.obj");
    manifest.addAsset("obj", "quad.obj");

    manifest.addAsset("shader", "phong.shader", {vertexShader: "phong.vert", fragmentShader: "phong.frag"});
    manifest.addAsset("mesh", "capsule.mesh", {geometry: "capsule.obj"});
    manifest.addAsset("mesh", "quad.mesh", {geometry: "quad.obj"});

    const assets = renderer.getAssetManager();
    const canvas = renderer.getCanvas();
    const gl = renderer.gl;

    this.inputManager = new InputManager(canvas);
    this.inputManager.setMouse(new Mouse(canvas));
    this.inputManager.setKeyboard(new Keyboard());

    this.inputContext = new InputContext();
    this.onInputSetup(this.inputContext);
    this.inputManager.addContext(this.inputContext);
    this.inputManager.addCallback(this.onInputUpdate);

    return super.onLoad(renderer)
    .then(() => assets.loadManifest(manifest))
    .then(() => {
      //Load mesh through cache
      assets.cacheAsset("mesh", "cube.mesh", new Mesh(gl, gl.TRIANGLES,
        new Float32Array(defaultPositions),
        new Float32Array(defaultTexcoords),
        new Float32Array(defaultNormals),
        new Uint16Array(defaultIndices)));
    });
  }

  onInputSetup(input)
  {
    input.registerState(
      "key", "down", InputCodes.KEY_SPACE, "key", "up", InputCodes.KEY_SPACE,
      new StateInput("moveUp"));
    input.registerState(
      "key", "down", InputCodes.KEY_E, "key", "up", InputCodes.KEY_E,
      new StateInput("moveDown"));
    input.registerState(
      "key", "down", InputCodes.KEY_A, "key", "up", InputCodes.KEY_A,
      new StateInput("strafeLeft"));
    input.registerState(
      "key", "down", InputCodes.KEY_D, "key", "up", InputCodes.KEY_D,
      new StateInput("strafeRight"));
    input.registerState(
      "key", "down", InputCodes.KEY_W, "key", "up", InputCodes.KEY_W,
      new StateInput("moveForward"));
    input.registerState(
      "key", "down", InputCodes.KEY_S, "key", "up", InputCodes.KEY_S,
      new StateInput("moveBackward"));

    input.registerRange("mouse", "move", InputCodes.MOUSE_X, new RangeInput("lookDX", -1, 1));
    input.registerRange("mouse", "move", InputCodes.MOUSE_Y, new RangeInput("lookDY", -1, 1));

    input.registerRange("mouse", "pos", InputCodes.MOUSE_X, new RangeInput("lookX", 0, 1));
    input.registerRange("mouse", "pos", InputCodes.MOUSE_Y, new RangeInput("lookY", 0, 1));

    if (this.getNextGameState())
    {
      this.getNextGameState().onInputSetup(input);
    }
  }

  onInputUpdate(input)
  {
    if (this.getNextGameState())
    {
      this.getNextGameState().onInputUpdate(input);
    }
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
    this.inputManager.removeCallback(this.onInputUpdate);
    this.inputManager.removeContext(this.inputContext);

    this.entityManager.clear();

    renderer.destroyRenderTarget(this.renderTarget);

    this.inputManager.destroy();
  }

  //Override
  isValidNextGameState(gameState)
  {
    return super.isValidNextGameState(gameState) && gameState instanceof GameState;
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
