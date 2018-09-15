import GameState from 'app/GameState.js';

import InputManager from 'input/InputManager.js';
import EntityManager from 'ecs/EntityManager.js';

import SceneNode from 'scenegraph/SceneNode.js';
import InputContext from 'input/context/InputContext.js';

import * as InputCodes from 'input/InputCodes.js';
import ActionInput from 'input/context/ActionInput.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';

import { mat4 } from 'gl-matrix';
import Mesh from 'render/mogli/Mesh.js';

import Renderable from 'world/components/Renderable.js';
import EntityTerrain from 'world/game/EntityTerrain.js';

class PlaneHero extends GameState
{
  constructor()
  {
    super();

    this.renderer = null;
    this.sceneGraph = new SceneNode();

    this.entityManager = new EntityManager();
    this.inputManager = null;
    this.inputContext = null;

    this.onInputUpdate = this.onInputUpdate.bind(this);

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    this.lookX = 0;
    this.lookY = 0;
  }

  //Override
  onLoad(opts)
  {
    if (!opts.canvas) throw new Error("Missing canvas from state opts");
    if (!opts.renderEngine) throw new Error("Missing renderEngine from state opts");

    this.inputManager = new InputManager(opts.canvas);
    this.inputContext = new InputContext();
    this.onInputSetup(this.inputContext);
    this.inputManager.addContext(this.inputContext);
    this.inputManager.addCallback(this.onInputUpdate);

    this.renderer = new PlaneHeroRenderer(this, opts.renderEngine);
    return super.onLoad(opts).then(() => this.renderer.load());
  }

  //Override
  onStart(opts)
  {
    super.onStart(opts);

    const inputManager = this.inputManager;
    inputManager.getMouse().allowCursorLock = true;

    const entityManager = this.entityManager;
    entityManager.registerComponentClass(Renderable);

    this.onWorldCreate();
  }

  onWorldCreate()
  {
    const sceneGraph = this.sceneGraph;
    const entityManager = this.entityManager;
    const cubeID = entityManager.createEntity("rotating");
    const cubeRenderable = entityManager.addComponentToEntity(cubeID, Renderable);
    cubeRenderable._sceneNode.setParent(sceneGraph);
    cubeRenderable._sceneNode.mesh = "cube.mesh";

    const capsuleID = entityManager.createEntity();
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";

    entityManager.addCustomEntity(new EntityTerrain(this));
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
  }

  //Override
  onInputUpdate(inputs)
  {
    this.up = inputs.getState("moveUp");
    this.left = inputs.getState("strafeLeft");
    this.down = inputs.getState("moveDown");
    this.right = inputs.getState("strafeRight");
    this.forward = inputs.getState("moveForward");
    this.backward = inputs.getState("moveBackward");

    if (inputs.hasRange("lookDX"))
    {
      this.lookX += inputs.getRange("lookDX") * -1;
    }
    if (inputs.hasRange("lookDY"))
    {
      this.lookY += inputs.getRange("lookDY") * -1;
    }

    if (inputs.hasRange("lookX"))
    {
      if (this.lookHelper) this.lookHelper.setX(inputs.getRange("lookX"));
    }
    if (inputs.hasRange("lookY"))
    {
      if (this.lookHelper) this.lookHelper.setY(inputs.getRange("lookY"));
    }
  }

  //Override
  onUpdate(dt)
  {
    this.inputManager.doInputUpdate();
    this.entityManager.update(dt);

    const entityManager = this.entityManager;
    const camera = this.renderer.getActiveCamera();
    const dx = this.left != this.right ? this.left ? 1 : -1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;

    camera.updateMove(dx, dy, dz);
    camera.updateLook(this.lookX, this.lookY);
    camera.onUpdate(dt);

    this.lookX = 0;
    this.lookY = 0;

    for(const renderable of entityManager.getComponentsFromTag(Renderable, "rotating"))
    {
      const transform = renderable.getTransform();
      mat4.rotateY(transform, transform, 0.01);
      mat4.rotateZ(transform, transform, 0.01);
    }

    for(const renderable of entityManager.getComponentsByClass(Renderable))
    {
      renderable._sceneNode.update(dt);
    }

    this.renderer.update();
  }

  //Override
  onStop(opts)
  {
    this.inputManager.removeCallback(this.onInputUpdate);
    this.inputManager.removeContext(this.inputContext);

    this.entityManager.clear();

    this.inputManager.destroy();
  }

  //Override
  onUnload(opts)
  {
    this.renderer.unload();
  }
}

import Renderer from 'app/Renderer.js';
import PlaneGeometry from 'render/mesh/PlaneGeometry.js';
import FreeLookCamera from 'render/camera/FreeLookCamera.js';
import SceneGraphRenderer from 'render/SceneGraphRenderer.js';
import AssetManifest from 'assets/pigeon/AssetManifest.js';

class PlaneHeroRenderer extends Renderer
{
  constructor(target, renderEngine)
  {
    super();

    this.target = target;
    this.renderEngine = renderEngine;

    this.camera = new FreeLookCamera(this.renderEngine.getCanvas());
    this.sceneGraphRenderer = new SceneGraphRenderer(this.renderEngine.getAssetManager());
  }

  //Override
  load()
  {
    const assetManager = this.renderEngine.getAssetManager();
    const gl = this.renderEngine.getGLContext();

    const manifest = new AssetManifest();
    manifest.addAsset("vert", "shader.vert");
    manifest.addAsset("frag", "shader.frag");
    manifest.addAsset("shader", "shader.shader", {vertexShader: "shader.vert", fragmentShader: "shader.frag"});
    manifest.addAsset("vert", "phong.vert");
    manifest.addAsset("frag", "phong.frag");
    manifest.addAsset("shader", "phong.shader", {vertexShader: "phong.vert", fragmentShader: "phong.frag"});

    manifest.addAsset("image", "capsule.jpg");
    manifest.addAsset("texture", "capsule.tex", {image: "capsule.jpg"});
    manifest.addAsset("image", "color.png");
    manifest.addAsset("texture", "color.tex", {image: "color.png"});
    manifest.addAsset("image", "rock.jpg");
    manifest.addAsset("texture", "rock.tex", {image: "rock.jpg"});

    manifest.addAsset("obj", "cube.obj");
    manifest.addAsset("obj", "capsule.obj");
    manifest.addAsset("mesh", "capsule.mesh", {geometry: "capsule.obj"});
    manifest.addAsset("obj", "quad.obj");
    manifest.addAsset("mesh", "quad.mesh", {geometry: "quad.obj"});

    const planeObj = new PlaneGeometry(10, 10, 10, 10);
    assetManager.cacheAsset("obj", "plane.obj", planeObj);
    assetManager.loadAsset("mesh", "plane.mesh", {geometry: "plane.obj"})
      .then((mesh) => {
        const texData = new Float32Array(planeObj.texcoords);
        const height = 10;
        const width = 10;
        let i = 0;
        for(let y = 0; y < height + 1; ++y)
        {
          for(let x = 0; x < width + 1; ++x)
          {
            texData[i++] = x % 2 === 0 ? 0 : 1;
            texData[i++] = y % 2 === 0 ? 0 : 1;
          }
        }
        mesh.texcoords.setData(texData);
      });

    return super.load()
    .then(() => assetManager.loadManifest(manifest))
    .then(() => {
      //Load mesh through cache
      assetManager.cacheAsset("mesh", "cube.mesh", new Mesh(gl,
        new Float32Array(defaultPositions),
        new Float32Array(defaultTexcoords),
        new Float32Array(defaultNormals),
        new Uint16Array(defaultIndices)));
    });
  }

  //Override
  unload()
  {
  }

  //Override
  update()
  {
    this.sceneGraphRenderer.render(this.renderEngine.getGLContext(), this.target.sceneGraph, this.camera);
  }

  getActiveCamera()
  {
    return this.camera;
  }
}

export default PlaneHero;

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
