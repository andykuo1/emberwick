import { vec3, mat4, quat } from 'gl-matrix';
import GameState from 'app/GameState.js';
import Renderable from 'world/components/Renderable.js';

import EntitySquare from './EntitySquare.js';
import LookHelper from 'world/LookHelper.js';

import PlaneGeometry from 'render/mesh/PlaneGeometry.js';
import EntityTerrain from './EntityTerrain.js';

class GameExample3 extends GameState
{
  constructor()
  {
    super();

    this.entityManager = null;
    this.renderTarget = null;

    this.playerID = -1;

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.forward = false;
    this.backward = false;
    this.lookX = 0;
    this.lookY = 0;

    this.lookHelper = new LookHelper();
    this.lookTarget = vec3.create();
    this.lookEntity = null;
  }

  onLoad(renderer)
  {
    const assets = renderer.getAssetManager();

    const plane = new PlaneGeometry(10, 10, 10, 10);
    assets.cacheAsset("obj", "plane.obj", plane);
    assets.loadAsset("mesh", "plane.mesh", {geometry: "plane.obj"});

    return super.onLoad();
  }

  //Override
  onStart()
  {
    super.onStart();

    const app = this.getPrevGameState();
    const entityManager = this.entityManager = app.entityManager;
    const renderTarget = this.renderTarget = app.renderTarget;

    const sceneGraph = renderTarget.getSceneGraph();
    entityManager.registerComponentClass(Renderable);

    const cubeID = entityManager.createEntity();
    const cubeRenderable = entityManager.addComponentToEntity(cubeID, Renderable);
    cubeRenderable._sceneNode.setParent(sceneGraph);
    cubeRenderable._sceneNode.mesh = "cube.mesh";
    cubeRenderable._sceneNode.material = "rock.tex";

    this.playerID = cubeID;

    const capsuleID = entityManager.createEntity("rotating");
    const capsuleRenderable = entityManager.addComponentToEntity(capsuleID, Renderable);
    capsuleRenderable._sceneNode.setParent(cubeRenderable._sceneNode);
    capsuleRenderable._sceneNode.mesh = "capsule.mesh";
    capsuleRenderable._sceneNode.material = "capsule.tex";

    const camera = renderTarget.getActiveCamera();
    this.lookHelper.setCamera(camera);
    camera.pitch = -45;
    //quat.rotateX(camera.rotation, camera.rotation, Math.PI / 4);
    camera.position[1] = -10;
    camera.position[2] = -10;
    this.lookEntity = entityManager.addCustomEntity(new EntitySquare(this));

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
    this.up = inputs.getState("moveForward");
    this.left = inputs.getState("strafeLeft");
    this.down = inputs.getState("moveBackward");
    this.right = inputs.getState("strafeRight");
    this.forward = inputs.getState("moveUp");
    this.backward = inputs.getState("moveDown");

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
      this.lookHelper.setX(inputs.getRange("lookX"));
    }
    if (inputs.hasRange("lookY"))
    {
      this.lookHelper.setY(inputs.getRange("lookY"));
    }
  }

  //Override
  onUpdate(dt)
  {
    const entityManager = this.entityManager;
    const camera = this.renderTarget.getActiveCamera();

    const dx = this.left != this.right ? this.left ? -1 : 1 : 0;
    const dy = this.forward != this.backward ? this.forward ? 1 : -1 : 0;
    const dz = this.up != this.down ? this.up ? -1 : 1 : 0;
    const playerRenderable = entityManager.getComponentFromEntity(Renderable, this.playerID);
    const playerTransform = playerRenderable.getTransform();
    mat4.translate(playerTransform, playerTransform, [dx * dt, dy * dt, dz * dt]);

    //camera.updateMove(dx, dz, dy);
    //camera.updateLook(this.lookX, this.lookY);
    //this.lookX = 0;
    //this.lookY = 0;
    camera.onUpdate(dt);
    const playerPosition = mat4.getTranslation(vec3.create(), playerTransform);
    camera.position[0] = -playerPosition[0];
    camera.position[1] = -playerPosition[1] - 10;
    camera.position[2] = -playerPosition[2] - 10;

    this.lookHelper.update();
    const et = this.lookEntity.getComponent(Renderable).getTransform();
    mat4.fromTranslation(et, this.lookHelper.getVector());

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

export default GameExample3;
