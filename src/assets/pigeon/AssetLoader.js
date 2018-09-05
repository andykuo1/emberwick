class AssetLoader
{
  constructor(assetManager, baseUrl="/", responseType="")
  {
    this.assetManager = assetManager;

    this._cache = new Map();
    this._loadQueue = new Map();
    this._cacheOnly = new Set();

    this._baseUrl = baseUrl;
    this._responseType = responseType;
  }

  clear()
  {
    for(const url of this._cache.keys())
    {
      this.unload(url);
    }

    this._loadQueue.clear();
    this._cache.clear();
    this._cacheOnly.clear();
  }

  //Called to process response before returning it for use
  onLoadResource(resource, opts, url)
  {
    return Promise.resolve(resource);
  }

  //Called to process resource before dumping from cache
  onUnloadResource(resource, url)
  {
  }

  load(url, opts,
    onSuccess=null, onError=null, onCancel=null, onProgress=null,
    dumpOnFail=true)
  {
    if (this._cache.has(url)) throw new Error("Asset with url \'" + url + "\' is already loaded");
    if (this._loadQueue.has(url)) throw new Error("Asset with url \'" + url + "\' is already loading");

    const context = { promise: null, request: null };
    const handler = (resolve, reject) => {
      const fullUrl = this._baseUrl + url;
      const request = context.request = new XMLHttpRequest();
      request.responseType = this._responseType;

      //Success / Failure
      request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {
            this.onLoadResource(request.response, opts, url)
              .then((response) => {
                console.log("[AssetLoader] Successfully loaded resource: \'" + url + "\'.");

                //Stop loading and add to cache
                //NOTE: A forceStop on unload will be ignored.
                this.cache(url, response, false, true, true);

                resolve(response);
              })
              .catch((error) => {
                console.log("[AssetLoader] Failed loading resource: \'" + url + "\'.");

                //Stop loading and remove from cache
                this.unload(url, dumpOnFail, true);

                if (onError) onError(error);
                reject(error);
              });
          }
          else
          {
            //Stop loading and remove from cache
            this.unload(url, dumpOnFail, true);

            const error = new Error("Failed to load resource from server - " + request.status);
            if (onError) onError(error);
            reject(error);
          }
        }
        else
        {
          //Still going...
        }
      };

      request.onerror = (e) => {
        //Stop loading and remove from cache
        this.unload(url, dumpOnFail, true);

        const error = new Error("Failed to load resource from server due to network error");
        if (onError) onError(error);
        reject(error);
      };

      //Cancel
      request.oncancel = (e) => {
        //Stop loading but still keep default in cache
        this.unload(url, false, true);

        if (onCancel) onCancel(e);
        resolve(null);
      };

      //Progress
      if (onProgress)
      {
        request.onprogress = (e) => {
          if (e.lengthComputable)
          {
            onProgress(e);
          }
        }
      }

      request.open('GET', fullUrl, true);
      request.send();
    };

    //Cache the asset as the default for immediate use (may be null)
    this._cache.set(url, this.getDefaultAsset());

    //May execute immediately... which would remove from loadQueue
    //Therefore, let it exist first to ensure it has not happened...
    this._loadQueue.set(url, context);
    context.promise = new Promise(handler);
    return context.promise;
  }

  cache(url, data, cacheOnly=true, ignoreLoad=false, forceCache=false)
  {
    if (!forceCache && this._cache.has(url)) throw new Error("Asset with url \'" + url + "\' is already cached");

    if (this._loadQueue.has(url))
    {
      if (ignoreLoad)
      {
        this._loadQueue.delete(url);
      }
      else
      {
        throw new Error("Asset with url \'" + url + "\' is already being loaded");
      }
    }

    if (cacheOnly)
    {
      this._cacheOnly.add(url);
    }

    this._cache.set(url, data);
  }

  reload(url, opts)
  {
    if (!this._cache.has(url)) throw new Error("Cannot find asset with url \'" + url + "\' to reload");
    if (this._cacheOnly.has(url)) throw new Error("Trying to reload cache-only asset with url \'" + url + "\'");

    //Wait if already loading...
    if (this._loadQueue.has(url)) return;

    this.unload(url);
    this.load(url, opts);
  }

  unload(url, clearCache=true, forceStop=false)
  {
    if (!this._cache.has(url)) throw new Error("Cannot find asset with url \'" + url + "\' to unload");

    //Abort current loading
    if (this._loadQueue.has(url))
    {
      if (!forceStop)
      {
        //Loader should be removed by itself... so don't do anything else
        this._loadQueue.get(url).request.abort();
      }
      else
      {
        this._loadQueue.delete(url);
      }
    }

    if (clearCache)
    {
      const data = this._cache.get(url);
      this.onUnloadResource(data, url);

      if (this._cacheOnly.has(url))
      {
        this._cacheOnly.delete(url);
      }

      this._cache.delete(url);
    }
  }

  hasAsset(url)
  {
    return this._cache.has(url);
  }

  getAsset(url, tryLoad=true)
  {
    if (this._loadQueue.has(url))
    {
      return this._loadQueue.get(url).promise;
    }
    else if (this._cache.has(url))
    {
      return Promise.resolve(this._cache.get(url));
    }
    else if (tryLoad)
    {
      return this.load(url, null);
    }
    else
    {
      return Promise.resolve(this.getDefaultAsset());
    }
  }

  getAssetImmediately(url)
  {
    if (this._cache.has(url))
    {
      return this._cache.get(url);
    }
    else
    {
      return this.getDefaultAsset();
    }
  }

  getDefaultAsset()
  {
    return null;
  }

  isAssetLoading(url)
  {
    return this._loadQueue.has(url);
  }

  isAssetFullyLoaded(url)
  {
    return this._cache.has(url) && !this._loadQueue.has(url);
  }
}

export default AssetLoader;
