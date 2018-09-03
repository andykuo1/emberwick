import SceneNode from 'scenegraph/SceneNode.js';
import InputContext from 'input/context/InputContext.js';

class Scene
{
  constructor(app)
  {
    this.app = app;
    this.input = app.input;
    this.entityManager = app.entityManager;
    this.sceneGraph = new SceneNode();
    this.inputContext = new InputContext();

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  onSceneLoad(gl)
  {
    console.log("[Scene] Loading scene...");
  }

  onSceneStart()
  {
    console.log("[Scene] Starting scene...");

    const input = this.input;
    const inputContext = this.inputContext;
    this.onInputSetup(input, inputContext);
    input.addContext(inputContext);
    input.addCallback(this.onInputUpdate);
  }

  onInputSetup(input, context)
  {

  }

  onInputUpdate(input)
  {

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

    const entityManager = this.entityManager;
    entityManager.clear();

    const input = this.input;
    input.removeCallback(this.onInputUpdate);
    input.removeContext(this.inputContext);
  }

  onSceneUnload(gl)
  {
    console.log("[Scene] Unloading scene...");
  }

  getSceneGraph()
  {
    return this.sceneGraph;
  }

  getInputContext()
  {
    return this.inputContext;
  }
}
export default Scene;
