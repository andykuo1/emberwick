import { mat4 } from 'gl-matrix';
import SimpleGameState from 'world/SimpleGameState.js';

import SceneNode from 'scenegraph/SceneNode.js';

import Renderable from 'world/planehero/Renderable.js';
import EntityTerrain from 'world/planehero/EntityTerrain.js';

class PlaneHero extends SimpleGameState
{
  constructor()
  {
    super();

    this.renderer = null;
    this.sceneGraph = new SceneNode();

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
    return super.onLoad(opts).then(() => {
      this.renderer = new PlaneHeroRenderer(this, opts.renderEngine);
      return this.renderer.load();
    });
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

  //Override
  onInputUpdate(inputs)
  {
    super.onInputUpdate(inputs);

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
    super.onUpdate(dt);

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
  onUnload(opts)
  {
    super.onUnload(opts);

    this.renderer.unload();
  }
}

import Renderer from 'app/Renderer.js';

import PlaneGeometry from 'render/mesh/PlaneGeometry.js';
import UnitCubeGeometry from 'render/mesh/UnitCubeGeometry.js';

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

    //manifest.addAsset("obj", "cube.obj");
    manifest.addAsset("obj", "capsule.obj");
    manifest.addAsset("mesh", "capsule.mesh", {geometry: "capsule.obj"});
    manifest.addAsset("obj", "quad.obj");
    manifest.addAsset("mesh", "quad.mesh", {geometry: "quad.obj"});

    assetManager.cacheAsset("obj", "cube.obj", new UnitCubeGeometry());
    assetManager.loadAsset("mesh", "cube.mesh", {geometry: "cube.obj"});

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

    return super.load().then(() => assetManager.loadManifest(manifest));
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
