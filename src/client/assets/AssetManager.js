import Eventable from 'util/Eventable.js';
import AssetLoader from './AssetLoader.js';

class AssetManager
{
  constructor(url)
  {
    this.nextAssetID = 1;
    this.baseUrl = url;

    this.activeLoaders = [];
    this.cachedAssets = new Map();

    this.registerEvent("idle");
  }

  clear()
  {
    //Cancel all active loaders
    for(const loader of this.activeLoaders)
    {
      loader.abort();
    }

    //Clear cache
    this.cachedAssets.clear();
  }

  loadAsset(url, callback=null)
  {
    const handle = this.getNextAvailableAssetID();
    const cacheData = {url: url, data:""};
    this.cachedAssets.set(handle, cacheData);

    const loader = new AssetLoader(this.baseUrl + url, "text")
      .onStop(() => {
        this.activeLoaders.splice(this.activeLoaders.indexOf(loader), 1)
        if (this.activeLoaders.length <= 0)
        {
          this.emit("idle");
        }
      });
    this.activeLoaders.push(loader);

    loader.fetch().then(
      response => {
        cacheData.data = response;
        console.log("Asset loaded: " + url);

        if (callback)
        {
          callback.call(null, this, handle, response);
        }
      },
      error => { throw error; });

    return handle;
  }

  getAsset(handle)
  {
    if (this.cachedAssets.has(handle))
    {
      return this.cachedAssets.get(handle).data;
    }
    else
    {
      return null;
    }
  }

  getAssetLocationByUrl(url)
  {
    let cacheData;
    for(const handle of this.cachedAssets.keys())
    {
      cacheData = this.cachedAssets.get(handle);
      if (cacheData.url == url)
      {
        return handle;
      }
    }
    return -1;
  }

  getNextAvailableAssetID()
  {
    return this.nextAssetID++;
  }
}
Eventable.mixin(AssetManager);

export default AssetManager;
