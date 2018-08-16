class AssetLoader
{
  constructor(url, type="")
  {
    this.request = null;
    this.response = null;
    this.responseType = type;
    this.url = url;

    this._requestLoad = [];
    this._requestError = [];
    this._requestProgress = null;
    this._requestStop = null;
  }

  fetch(...args)
  {
    const request = new XMLHttpRequest();
    this.request = request;

    return new Promise((resolve, reject) => {
      request.responseType = this.responseType;
      request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {
            this.processResponse(request.response)
              .then((response) => {
                this._onLoad(response);

                this.response = response;

                this._onStop();
                this.request = null;

                resolve(response);
              });
          }
          else
          {
            this._onStop();
            this.request = null;

            const error = new Error("Failed to load resource from server - " + request.status);
            this._onError(error);
            reject(error);
          }
        }
      };
      request.onerror = (e) => {
        this._onStop();
        this.request = null;

        this._onError(e);
        reject(new Error("Failed to load resource from server due to network error"));
      };
      request.oncancel = (e) => {
        this._onStop();
        this.request = null;
      };
      request.onprogress = (e) => {
        if (e.lengthComputable)
        {
          this._onProgress(e.loaded, e.total);
        }
      };
      request.open('GET', this.url, true);
      request.send();
    });
  }

  unload(data)
  {
    if (this.request != null)
    {
      this.abort();
    }
  }

  abort()
  {
    this.request.abort();
  }

  processResponse(response)
  {
    return Promise.resolve(response);
  }

  onLoad(callback)
  {
    this._requestLoad.push(callback);
    return this;
  }

  onError(callback)
  {
    this._requestError.push(callback);
    return this;
  }

  onProgress(callback)
  {
    this._requestProgress = callback;
    return this;
  }

  onStop(callback)
  {
    this._requestStop = callback;
    return this;
  }

  isActive()
  {
    return this.request != null;
  }

  _onLoad(response)
  {
    if (this._requestLoad.length > 0)
    {
      for(const callback of this._requestLoad)
      {
        callback.call(null, response);
      }
    }
  }

  _onError(error)
  {
    if (this._requestError.length > 0)
    {
      for(const callback of this._requestError)
      {
        callback.call(null, error);
      }
    }
  }

  _onProgress(value, max)
  {
    if (this._requestProgress)
    {
      this._requestProgress.call(null, value, max);
    }
  }

  _onStop()
  {
    if (this._requestStop)
    {
      this._requestStop();
    }
  }
}

export default AssetLoader;
