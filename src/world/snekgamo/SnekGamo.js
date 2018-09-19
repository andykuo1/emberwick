import SimpleGameState from '../SimpleGameState.js';

import Drawable from './Drawable.js';

import EntityBox from './EntityBox.js';

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

    const inputManager = this.inputManager;
    inputManager.getMouse().allowCursorLock = true;

    const entityManager = this.entityManager;
    entityManager.registerComponentClass(Drawable);

    this.onWorldCreate();
  }

  onWorldCreate()
  {
    const entityManager = this.entityManager;
    entityManager.addCustomEntity(new EntityBox());
  }

  //Override
  onInputUpdate(input)
  {
    super.onInputUpdate(input);

    const camera = this.renderer.getActiveCamera();
    camera.updateInput(input);
  }

  onUpdate(dt)
  {
    super.onUpdate(dt);

    const camera = this.renderer.getActiveCamera();
    camera.onUpdate(dt);

    this.renderer.update();
  }

  onStop(opts)
  {
    super.onStop(opts);
  }

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
import DrawableRenderer from './DrawableRenderer.js';
import AssetManifest from 'assets/pigeon/AssetManifest.js';

class SnekGamoRenderer extends Renderer
{
  constructor(target, renderEngine)
  {
    super();

    this.target = target;
    this.renderEngine = renderEngine;

    this.camera = new FreeLookCamera(this.renderEngine.getCanvas());
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
        mesh.getAttribute("a_texcoord").setBufferData(texData);
      });

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
