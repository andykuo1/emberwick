class Scene
{
  constructor(app)
  {

  }

  onSceneLoad(gl)
  {
    console.log("LOADING...");
  }

  onSceneStart()
  {
    console.log("STARTING...");
  }

  onSceneUpdate(dt)
  {
  }

  onSceneRender(gl)
  {
  }

  onSceneStop()
  {
    console.log("STOPPING...");
  }

  onSceneUnload(gl)
  {
    console.log("UNLOADING...");
  }
}
export default Scene;
