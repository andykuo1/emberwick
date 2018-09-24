import SimpleGameState from '../SimpleGameState.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

import EntityBox from './EntityBox.js';
import EntitySnek from './EntitySnek.js';

class SnekGamo extends SimpleGameState
{
  constructor()
  {
    super();

    this.renderer = null;
  }

  onLoad(opts)
  {
    return super.onLoad(opts).then(() => {
      this.renderer = new SnekGamoRenderer(this, opts.renderEngine);
      return this.renderer.load();
    });
  }

  onStart(opts)
  {
    super.onStart(opts);

    const entityManager = this.entityManager;
    entityManager.registerComponentClass(Drawable);
    entityManager.registerComponentClass(Transform);
    entityManager.registerComponentClass(Motion);

    this.onWorldCreate();
  }

  onWorldCreate()
  {
    const entityManager = this.entityManager;
    entityManager.addCustomEntity(new EntityBox(this));
    entityManager.addCustomEntity(new EntitySnek(this));
  }

  //Override
  onInputUpdate(input)
  {
    super.onInputUpdate(input);
  }

  //Override
  onUpdate(dt)
  {
    //this.earlyUpdate(dt);

    super.onUpdate(dt);
    //this.update(dt);

    //this.lateUpdate(dt);

    const camera = this.renderer.getActiveCamera();
    camera.onUpdate(dt);

    this.renderer.update();
  }

  //Override
  onStop(opts)
  {
    super.onStop(opts);
  }

  //Override
  onUnload(opts)
  {
    super.onUnload(opts);

    this.renderer.unload();
  }
}

import Renderer from 'app/Renderer.js';
import AssetManifest from 'assets/pigeon/AssetManifest.js';

import FreeLookCamera from 'render/camera/FreeLookCamera.js';

import DrawableRenderer from './DrawableRenderer.js';

class SnekGamoRenderer extends Renderer
{
  constructor(target, renderEngine)
  {
    super();

    this.target = target;
    this.renderEngine = renderEngine;

    this.camera = new FreeLookCamera(this.renderEngine.getViewPort());
    this.camera.position[2] = -50;
    this.drawableRenderer = new DrawableRenderer(this.renderEngine.getAssetManager());
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
    manifest.addAsset("mesh", "cube.mesh", {geometry: "cube.obj"});
    manifest.addAsset("obj", "capsule.obj");
    manifest.addAsset("mesh", "capsule.mesh", {geometry: "capsule.obj"});
    manifest.addAsset("obj", "quad.obj");
    manifest.addAsset("mesh", "quad.mesh", {geometry: "quad.obj"});

    return super.load().then(() => assetManager.loadManifest(manifest));
  }

  //Override
  update()
  {
    super.update();
    this.drawableRenderer.render(this.renderEngine.getGLContext(), this.target, this.camera);
  }

  getActiveCamera()
  {
    return this.camera;
  }
}

export default SnekGamo;
