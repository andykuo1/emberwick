import Eventable from 'util/Eventable.js';

import AssetLoader from './loader/AssetLoader.js';
import TextLoader from './loader/TextLoader.js';
import ImageLoader from './loader/ImageLoader.js';
import OBJLoader from './loader/OBJLoader.js';

class AssetManager
{
  constructor(url)
  {
    this.nextAssetID = 1;
    this.baseUrl = url;

    this.assetLoaders = new Map();
    this.activeLoaders = [];
    this.cachedAssets = new Map();

    this.registerLoader(".vert", TextLoader);
    this.registerLoader(".frag", TextLoader);
    this.registerLoader(".png", ImageLoader);
    this.registerLoader(".obj", OBJLoader);

    this.registerEvent("idle");
  }

  registerLoader(fileExt, loaderClass)
  {
    this.assetLoaders.set(fileExt, loaderClass);
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

    const fileExt = url.substring(url.lastIndexOf('.'));
    const loaderClass = this.assetLoaders.get(fileExt);
    if (!loaderClass) throw new Error("Missing asset loader for file extension \'" + fileExt + "\'");

    const loader = new loaderClass(this.baseUrl + url)
      .onLoad((response) => {
        cacheData.data = response;
        console.log("[" + loaderClass.name + "] Loaded asset \'" + url + "\'.");

        if (callback)
        {
          callback.call(null, this, handle, response);
        }
      });

    this.activeLoaders.push(loader);
    loader.fetch().then((response) => {
      this.activeLoaders.splice(this.activeLoaders.indexOf(loader), 1);

      if (this.activeLoaders.length <= 0)
      {
        this.emit("idle");
      }
    });

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
