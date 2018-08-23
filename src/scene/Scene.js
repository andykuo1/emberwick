import SceneNode from 'scenegraph/SceneNode.js';

class Scene
{
  constructor(app)
  {
    this.app = app;
    this.sceneGraph = new SceneNode();
  }

  onSceneLoad(gl)
  {
    console.log("[Scene] Loading scene...");
  }

  onSceneStart()
  {
    console.log("[Scene] Starting scene...");
  }

  onSceneUpdate(dt)
  {
  }

  onSceneRender(gl)
  {
  }

  onSceneStop()
  {
    console.log("[Scene] Stopping scene...");
  }

  onSceneUnload(gl)
  {
    console.log("[Scene] Unloading scene...");
  }

  getSceneGraph()
  {
    return this.sceneGraph;
  }
}
export default Scene;
