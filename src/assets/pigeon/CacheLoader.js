import AssetLoader from './AssetLoader.js';

class CacheLoader extends AssetLoader
{
  constructor(assetManager)
  {
    super(assetManager, "/", "cacheonly");
  }

  //Override
  load(url, opts,
    onSuccess=null, onError=null, onCancel=null, onProgress=null,
    dumpOnFail=true)
  {
    if (this._cache.has(url)) throw new Error("Asset with url \'" + url + "\' is already loaded");
    if (this._loadQueue.has(url)) throw new Error("Asset with url \'" + url + "\' is already loading");

    const context = { promise: null, request: null };
    const handler = (resolve, reject) => {
      //Start progress
      if (onProgress) onProgress({loaded: 0, total: 1});

      this.onLoadResource(null, opts, url)
        .then((response) => {
          console.log("[CacheLoader] Successfully loaded cached resource: \'" + url + "\'.");

          //Update progress
          if (onProgress) onProgress({loaded: 1, total: 1});

          //Stop loading and add to cache (as cache-only)
          this.cache(url, response, true, true, true);

          resolve(response);
        })
        .catch((error) => {
          console.log("[CacheLoader] Failed loading cached resource: \'" + url + "\'.");

          //Stop loading and remove from cache
          this.unload(url, dumpOnFail, true);

          if (onError) onError(error);
          reject(error);
        });
    };

    //Cache the asset as the default for immediate use (may be null)
    this._cache.set(url, this.getDefaultAsset());

    //May execute immediately... which would remove from loadQueue
    //Therefore, let it exist first to ensure it has not happened...
    this._loadQueue.set(url, context);
    context.promise = new Promise(handler);
    return context.promise;
  }

  //Override
  reload(url, opts)
  {
    throw new Error("Trying to reload cache-only asset with url \'" + url + "\'");
  }
}

export default CacheLoader;
