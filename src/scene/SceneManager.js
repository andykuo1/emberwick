const LOAD_BIT = 0x1;
const START_BIT = 0x2;
const STOP_BIT = 0x4;
const UNLOAD_BIT = 0x8;

const READY_BITS = LOAD_BIT | START_BIT;
const DEAD_BITS = UNLOAD_BIT | STOP_BIT;

class SceneManager
{
  constructor()
  {
    this.sceneBits = DEAD_BITS;

    this.scene = null;
    this.nextScene = null;
  }

  destroy()
  {
    this.nextScene = null;

    if (this.scene && ((this.sceneBits & STOP_BIT) == 0))
    {
      this.scene.onSceneStop();
      this.sceneBits |= STOP_BIT;
    }
  }

  unload(gl)
  {
    if ((this.sceneBits & STOP_BIT) == 0)
    {
      throw new Error("Scene needs to be destroyed before unloading");
    }

    this.scene.onSceneUnload(gl);
    this.sceneBits |= UNLOAD_BIT;

    this.scene = null;
    this.sceneBits = DEAD_BITS;
  }

  update(dt)
  {
    if (this.nextScene && this.scene &&
      ((this.sceneBits & STOP_BIT) == 0))
    {
      try
      {
        this.scene.onSceneStop();
      }
      catch(e)
      {
        throw e;
      }
      finally
      {
        this.sceneBits |= STOP_BIT;
      }
    }

    if (this.nextScene &&
      ((this.sceneBits & STOP_BIT) != 0) &&
      ((this.sceneBits & UNLOAD_BIT) != 0))
    {
      this.scene = this.nextScene;
      this.nextScene = null;

      this.sceneBits = 0;
    }

    if (!this.nextScene && this.scene &&
      ((this.sceneBits & LOAD_BIT) != 0) &&
      ((this.sceneBits & START_BIT) == 0))
    {
      try
      {
        this.scene.onSceneStart();
      }
      catch (e)
      {
        throw e;
      }
      finally
      {
        this.sceneBits |= START_BIT;
      }
    }

    if (!this.nextScene && this.scene &&
      (this.sceneBits == READY_BITS))
    {
      this.scene.onSceneUpdate(dt);
    }
  }

  render(gl)
  {
    if (this.nextScene && this.scene &&
      ((this.sceneBits & STOP_BIT) != 0) &&
      ((this.sceneBits & UNLOAD_BIT) == 0))
    {
      try
      {
        this.scene.onSceneUnload(gl);
      }
      catch(e)
      {
        throw e;
      }
      finally
      {
        this.sceneBits |= UNLOAD_BIT;
      }
    }

    if (!this.nextScene && this.scene &&
      ((this.sceneBits & LOAD_BIT) == 0))
    {
      try
      {
        this.scene.onSceneLoad(gl);
      }
      catch(e)
      {
        throw e;
      }
      finally
      {
        this.sceneBits |= LOAD_BIT;
      }
    }

    if (!this.nextScene && this.scene &&
      (this.sceneBits == READY_BITS))
    {
      this.scene.onSceneRender(gl);
    }
  }

  setNextScene(scene)
  {
    this.nextScene = scene;
  }

  getScene()
  {
    return this.scene;
  }
}

export default SceneManager;
