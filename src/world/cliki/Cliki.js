import {vec3} from 'gl-matrix';

import SimpleGameState from '../SimpleGameState.js';

import Drawable from './Drawable.js';
import Sprite from './Sprite.js';

import EntityBall from './EntityBall.js';
import EntityParticle from './EntityParticle.js';

import SpriteSystem from './SpriteSystem.js';

class Cliki extends SimpleGameState
{
  constructor()
  {
    super();

    this.renderer = null;

    this.spriteSystem = null;

    this.player = null;
    this.score = 0;
  }

  //Override
  onLoad(opts)
  {
    return super.onLoad(opts).then(() => {
      this.renderer = new ClikiRenderer(this, opts.renderEngine);
      return this.renderer.load();
    });
  }

  //Override
  onStart(opts)
  {
    super.onStart(opts);

    const entityManager = this.entityManager;
    entityManager.registerComponentClass(Drawable);
    entityManager.registerComponentClass(Sprite);

    this.spriteSystem = new SpriteSystem(entityManager);

    this.onWorldCreate(entityManager);
  }

  onWorldCreate(entityManager)
  {
    this.player = entityManager.addCustomEntity(new EntityBall(this));
  }

  //Override
  onInputUpdate(input)
  {
    super.onInputUpdate(input);

    if (input.getAction("cursorPrimary"))
    {
      const lookX = input.getRange("lookX", false);
      const lookY = input.getRange("lookY", false);
      const camera = this.renderer.getActiveCamera();
      const raycast = camera.screenToWorld(lookX, lookY);
      const vec = raycast.position;
      vec[2] = 0;

      const player = this.player;

      //Check collision with ball
      const dx = player.x - vec[0];
      const dy = player.y - vec[1];
      const dist = dx * dx + dy * dy;
      const rad = player.radius + player.bufferRadius;

      if (dist < rad * rad)
      {
        player.onHit();
        ++this.score;
      }
    }
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.spriteSystem.update(dt);

    this.renderer.update();
  }

  //Override
  onUnload(opts)
  {
    this.renderer.unload();
    super.onUnload(opts);
  }
}

export default Cliki;

import Renderer from 'app/Renderer.js';

import PerspectiveCamera from 'render/mogli/PerspectiveCamera.js';
import OrthographicCamera from 'render/mogli/OrthographicCamera.js';
import DrawableRenderer from './DrawableRenderer.js';

import SimpleAssets from '../SimpleAssets.js';

class ClikiRenderer extends Renderer
{
  constructor(target, renderEngine)
  {
    super();
    this.target = target;
    this.renderEngine = renderEngine;

    this.camera = new OrthographicCamera(this.renderEngine.getViewPort());
    this.camera.position[2] = -50;
    this.drawableRenderer = new DrawableRenderer(this.renderEngine.getAssetManager());
  }

  //Override
  load()
  {
    const assetManager = this.renderEngine.getAssetManager();
    const gl = this.renderEngine.getGLContext();

    return super.load().then(() => assetManager.loadManifest(SimpleAssets));
  }

  //Override
  update()
  {
    const gl = this.renderEngine.getGLContext();
    this.drawableRenderer.render(gl, this.target, this.camera);
  }

  getActiveCamera()
  {
    return this.camera;
  }
}
