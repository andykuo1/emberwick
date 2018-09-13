import { mat4 } from 'gl-matrix';
import GameState from 'app/GameState.js';
import Renderable from 'world/components/Renderable.js';

import PlaneGeometry from 'render/mesh/PlaneGeometry.js';

import EntityTerrain from './EntityTerrain.js';

class GameExample extends GameState
{
  constructor()
  {
    super();

    this.entityManager = null;
    this.renderTarget = null;

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
  onLoad(renderer)
  {
    const assets = renderer.getAssetManager();

    const plane = new PlaneGeometry(10, 10, 10, 10);
    assets.cacheAsset("obj", "plane.obj", plane);
    assets.loadAsset("mesh", "plane.mesh", {geometry: "plane.obj"});

    return super.onLoad(renderer);
  }

  //Override
  onStart()
  {
    super.onStart();

    const app = this.getPrevGameState();

    const inputManager = app.inputManager;
    inputManager.getMouse().allowCursorLock = true;

    const entityManager = this.entityManager = app.entityManager;
    const renderTarget = this.renderTarget = app.renderTarget;

    const sceneGraph = renderTarget.getSceneGraph();
    entityManager.registerComponentClass(Renderable);

    const cubeID = entityManager.createEntity("rotating");
    const cubeRenderable = entityManager.addComponentToEntity(cubeID, Renderable);
    cubeRenderable._sceneNode.setParent(sceneGraph);
    cubeRenderable._sceneNode.mesh = "cube.mesh";

    const capsuleID = entityManager.createEntity();
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";

    entityManager.addCustomEntity(new EntityTerrain(this));

    const assets = this.renderTarget.renderer.getAssetManager();
    const planeMesh = assets.getAssetImmediately("mesh", "plane.mesh");
    const planeObj = assets.getAssetImmediately("obj", "plane.obj");
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
    planeMesh.texcoords.setData(texData);
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
  }

  //Override
  onUpdate(dt)
  {
    const entityManager = this.entityManager;
    const camera = this.renderTarget.getActiveCamera();
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
  }
}

export default GameExample;
