import SceneNode from 'scenegraph/SceneNode.js';
import AssetManifest from 'assets/pigeon/AssetManifest.js';
import FreeLookCamera from 'render/camera/FreeLookCamera.js';

class RenderTarget
{
  constructor(renderer)
  {
    this.renderer = renderer;
    this.sceneGraph = new SceneNode();
    this.assetManifest = new AssetManifest();
    this.camera = new FreeLookCamera(renderer.canvas);
  }

  getAssetManifest()
  {
    return this.assetManifest;
  }

  getSceneGraph()
  {
    return this.sceneGraph;
  }

  getActiveCamera()
  {
    return this.camera;
  }

  getShader()
  {
    return "phong.shader";
  }
}

export default RenderTarget;
