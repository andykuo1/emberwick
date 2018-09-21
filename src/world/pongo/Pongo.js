import SimpleGameState from '../SimpleGameState.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

import DrawableSystem from './DrawableSystem.js';
import MotionSystem from './MotionSystem.js';
import PlayerSystem from './PlayerSystem.js';

import EntityBall from './EntityBall.js';
import EntityPaddle from './EntityPaddle.js';

class Pongo extends SimpleGameState
{
  constructor()
  {
    super();

    this.renderer = null;
    this.drawableSystem = null;
    this.motionSystem = null;
  }

  //Override
  onLoad(opts)
  {
    return super.onLoad(opts).then(() => {
      this.renderer = new PongoRenderer(this, opts.renderEngine);
      return this.renderer.load();
    });
  }

  //Override
  onStart(opts)
  {
    super.onStart(opts);

    const entityManager = this.entityManager;
    entityManager.registerComponentClass(Drawable);
    entityManager.registerComponentClass(Transform);
    entityManager.registerComponentClass(Motion);

    this.drawableSystem = new DrawableSystem(entityManager);
    this.motionSystem = new MotionSystem(entityManager);
    this.playerSystem = new PlayerSystem(entityManager);

    this.onWorldCreate();
  }

  onWorldCreate()
  {
    const entityManager = this.entityManager;
    const player = entityManager.addCustomEntity(new EntityPaddle(this, 10));
    const other = entityManager.addCustomEntity(new EntityPaddle(this, -10));
    const ball = entityManager.addCustomEntity(new EntityBall(this));

    this.playerSystem.setPlayer(player.getEntityID());
  }

  //Override
  onInputUpdate(input)
  {
    super.onInputUpdate(input);

    this.playerSystem.onInputUpdate(input);
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);
    this.motionSystem.onLateUpdate(dt);
    this.drawableSystem.onLateUpdate(dt);

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
    this.renderer.unload();
    super.onUnload(opts);
  }
}

import Renderer from 'app/Renderer.js';

import FreeLookCamera from 'render/camera/FreeLookCamera.js';
import DrawableRenderer from './DrawableRenderer.js';
import AssetManifest from 'assets/pigeon/AssetManifest.js';

class PongoRenderer extends Renderer
{
  constructor(target, renderEngine)
  {
    super();

    this.target = target;
    this.renderEngine = renderEngine;

    this.camera = new FreeLookCamera(this.renderEngine.getCanvas());
    this.camera.position[2] = -50;
    this.drawableRenderer = new DrawableRenderer(this.renderEngine.getAssetManager());
  }

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

    manifest.addAsset("obj", "ball.obj");
    manifest.addAsset("mesh", "ball.mesh", {geometry: "ball.obj"});

    return super.load().then(() => assetManager.loadManifest(manifest));
  }

  update()
  {
    this.drawableRenderer.render(this.renderEngine.getGLContext(), this.target, this.camera);
  }

  getActiveCamera()
  {
    return this.camera;
  }
}

export default Pongo;
