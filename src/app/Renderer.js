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
  }

  update() {}
}

export default Renderer;
