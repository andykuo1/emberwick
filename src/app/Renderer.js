class Renderer
{
  load()
  {
    console.log("[Renderer] Loading renderer...");
    return Promise.resolve();
  }

  unload()
  {
    console.log("[Renderer] Unloading renderer...");
    this.renderTargets.length = 0;
  }

  update() {}
}

export default Renderer;
