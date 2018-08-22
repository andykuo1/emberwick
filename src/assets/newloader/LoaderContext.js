class LoaderContext
{
  constructor()
  {
    this.request = null;
    this.response = null;

    this.requestLoad = [];
    this.requestError = [];
    this.requestProgress = null;
    this.requestStop = null;

    this.src = null;
    this.url = null;
    this.loader = null;
    this.result = null;
  }

  init(loader, url, src)
  {
    this.loader = loader;
    this.src = src;
  }

  isActive()
  {
    return this.src != null;
  }

  setResult(result)
  {
    if (result)
    {
      //Success!
    }
    else
    {
      //Failure!
    }

    this.result = result;
  }

  setError(error)
  {
    //Error!
  }

  updateProgress(value, max)
  {

  }

  onLoad(result)
  {
    if (this._requestLoad.length > 0)
    {
      for(const callback of this._requestLoad)
      {
        callback.call(null, response);
      }
    }
  }

  onError(error)
  {
    if (this._requestError.length > 0)
    {
      for(const callback of this._requestError)
      {
        callback.call(null, error);
      }
    }
  }

  onProgress(value, max)
  {
    if (this._requestProgress)
    {
      this._requestProgress.call(null, value, max);
    }
  }

  onStop()
  {
    if (this._requestStop)
    {
      this._requestStop();
    }
  }
}

export default LoaderContext;
