import {vec3} from 'gl-matrix';

import SimpleGameState from '../SimpleGameState.js';

import Drawable from './Drawable.js';

import EntityBall from './EntityBall.js';
import EntityParticle from './EntityParticle.js';

class Cliki extends SimpleGameState
{
  constructor()
  {
    super();

    this.renderer = null;

    this.player = null;
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

      this.getEntityManager().addCustomEntity(new EntityParticle(this, vec[0], vec[1]));

      //Check collision with ball
      const dx = player.x - vec[0];
      const dy = player.y - vec[1];
      const dist = dx * dx + dy * dy;
      const rad = player.radius + player.bufferRadius;

      if (dist < rad * rad)
      {
        player.onHit();
      }
    }
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

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
import AssetManifest from 'assets/pigeon/AssetManifest.js';

import PerspectiveCamera from 'render/mogli/PerspectiveCamera.js';
import OrthographicCamera from 'render/mogli/OrthographicCamera.js';
import DrawableRenderer from './DrawableRenderer.js';

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
