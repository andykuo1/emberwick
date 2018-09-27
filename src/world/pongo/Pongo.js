import SimpleGameState from '../SimpleGameState.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';
import Collider from './Collider.js';

import DrawableSystem from './DrawableSystem.js';
import MotionSystem from './MotionSystem.js';
import PlayerSystem from './PlayerSystem.js';
import CollisionSystem from './CollisionSystem.js';

import EntityBall from './EntityBall.js';
import EntityPaddle from './EntityPaddle.js';

import EntityWall from './EntityWall.js';

class Pongo extends SimpleGameState
{
  constructor()
  {
    super();

    this.renderer = null;

    this.drawableSystem = null;
    this.motionSystem = null;
    this.playerSystem = null;
    this.collisionSystem = null;
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
    entityManager.registerComponentClass(Collider);

    this.drawableSystem = new DrawableSystem(entityManager);
    this.motionSystem = new MotionSystem(entityManager);
    this.playerSystem = new PlayerSystem(entityManager);
    this.collisionSystem = new CollisionSystem(entityManager);

    this.onWorldCreate();
  }

  onWorldCreate()
  {
    const entityManager = this.entityManager;
    const player = entityManager.addCustomEntity(new EntityPaddle(this, 10));
    const other = entityManager.addCustomEntity(new EntityPaddle(this, -10));
    const ball = entityManager.addCustomEntity(new EntityBall(this));

    EntityWall.create(entityManager, 0, 10, 40, 1, "wall");
    EntityWall.create(entityManager, 0, -10, 40, 1, "wall");
    EntityWall.create(entityManager, 15, 0, 1, 25, "wall");
    EntityWall.create(entityManager, -15, 0, 1, 25, "wall");

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
    this.motionSystem.onUpdate(dt);
    this.collisionSystem.onUpdate(dt);

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
//import AssetManifest from 'assets/pigeon/AssetManifest.js';

import SimpleAssets from '../SimpleAssets.js';

import FreeLookCamera from 'render/camera/FreeLookCamera.js';

import DrawableRenderer from './DrawableRenderer.js';
import ColliderRenderer from './ColliderRenderer.js';

class PongoRenderer extends Renderer
{
  constructor(target, renderEngine)
  {
    super();

    this.target = target;
    this.renderEngine = renderEngine;

    this.camera = new FreeLookCamera(this.renderEngine.getViewPort());
    this.camera.position[2] = -50;
    this.drawableRenderer = new DrawableRenderer(this.renderEngine.getAssetManager());
    this.colliderRenderer = new ColliderRenderer(this.renderEngine.getAssetManager());
  }

  load()
  {
    const assetManager = this.renderEngine.getAssetManager();
    const gl = this.renderEngine.getGLContext();

    return super.load().then(() => assetManager.loadManifest(SimpleAssets));
  }

  update()
  {
    const gl = this.renderEngine.getGLContext();
    this.drawableRenderer.render(gl, this.target, this.camera);
    this.colliderRenderer.render(gl, this.target, this.camera);
  }

  getActiveCamera()
  {
    return this.camera;
  }
}

export default Pongo;
