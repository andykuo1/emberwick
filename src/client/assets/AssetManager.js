import Eventable from 'util/Eventable.js';

import AssetLoader from './loader/AssetLoader.js';
import TextLoader from './loader/TextLoader.js';
import ImageLoader from './loader/ImageLoader.js';
import OBJLoader from './loader/OBJLoader.js';
import MeshLoader from './loader/MeshLoader.js';

class AssetManager
{
  constructor(url)
  {
    this.baseUrl = url;

    this.assetLoaders = new Map();
    this.activeLoaders = new Map();

    this.cachedAssets = new Map();

    this.registerLoader(".vert", TextLoader);
    this.registerLoader(".frag", TextLoader);
    this.registerLoader(".png", ImageLoader);
    this.registerLoader(".jpg", ImageLoader);
    this.registerLoader(".obj", OBJLoader);
    this.registerLoader(".mesh", MeshLoader);

    this.registerEvent("idle");
  }

  registerLoader(fileExt, loaderClass)
  {
    this.assetLoaders.set(fileExt, loaderClass);
  }

  clear()
  {
    //Cancel all active loaders
    for(const loader of this.activeLoaders.values())
    {
      try
      {
        loader.abort();
      }
      catch(e)
      {
        console.error(e);
      }
    }

    //Clear cache
    for(const assetID of this.cachedAssets.keys())
    {
      const loaderClass = this.getAssetLoaderForUrl(assetID);
      const assetData = this.cachedAssets.get(assetID);
      new loaderClass(assetID).unload(assetData);
    }
    this.cachedAssets.clear();
  }

  loadAsset(url, ...args)
  {
    if (this.isAssetLoading(url))
    {
      throw new Error("Cannot load the same asset \'" + url + "\' at the same time");
    }

    //Prepare loader to begin loading asset
    const fullUrl = this.baseUrl + url;
    const loaderClass = this.getAssetLoaderForUrl(url);
    //Prepare cache for asset
    const id = url;
    const cacheData = this.getDefaultAsset(loaderClass);
    this.cachedAssets.set(id, cacheData);
    //Start loader...
    const loader = new loaderClass(fullUrl)
      .onLoad((response) => {
        this.cachedAssets.set(id, response);

        console.log("[" + loaderClass.name + "] Loaded asset \'" + id + "\'.")
      })
      .onStop(() => {
        this.activeLoaders.delete(id);

        //No more asset loaders are working...
        if (this.activeLoaders.size <= 0) this.emit("idle");
      });
    //Make sure it is an active loader FIRST...
    this.activeLoaders.set(id, loader);
    //Then try to begin loading...
    return loader.fetch(...args);
  }

  cacheAsset(id, assetData)
  {
    this.cachedAssets.set(id, assetData);

    console.log("[AssetCache] Cached asset \'" + id + "\'.");
  }

  getDefaultAsset(loaderClass)
  {
    //TODO: this should return USABLE default assets
    return "";
  }

  getAssetLoaderForUrl(url)
  {
    const fileExt = url.substring(url.lastIndexOf('.'));
    const loaderClass = this.assetLoaders.get(fileExt);
    if (!loaderClass) throw new Error("Missing asset loader for file extension \'" + fileExt + "\'");
    return loaderClass;
  }

  getAsset(id, immediate=true)
  {
    if (this.cachedAssets.has(id))
    {
      if (immediate)
      {
        return this.cachedAssets.get(id);
      }
      else
      {
        //Wait for the real asset that is currently loading...
        return new Promise((resolve, reject) => {
          const loader = this.activeLoaders.get(id);
          if (loader)
          {
            loader.onLoad((response) => {
              resolve(response);
            })
            .onError((error) => {
              reject(error);
            });
          }
          //Was just finished loading...
          else
          {
            resolve(this.cachedAssets.get(id));
          }
        });
      }
    }
    else
    {
      throw new Error("Cannot find loading/cached asset with id \'" + id + "\'");
    }
  }

  hasAsset(id)
  {
    return this.cachedAssets.has(id);
  }

  isAssetLoading(id)
  {
    return this.activeLoaders.has(id);
  }

  isAssetFullyLoaded(id)
  {
    return this.cachedAssets.has(id) && !this.activeLoaders.has(id);
  }
}
Eventable.mixin(AssetManager);

export default AssetManager;
