class AssetManager
{
  constructor()
  {
    this._loaders = new Map();
  }

  clear()
  {
    for(const loader of this._loaders.values())
    {
      loader.clear();
    }
    this._loaders.clear();
  }

  registerAssetLoader(type, loader)
  {
    if (typeof type !== 'string') throw new Error("Asset type must be a string");
    if (this._loaders.has(type)) throw new Error("Found already registered loader for type \'" + type + "\'");

    this._loaders.set(type, loader);
  }

  getAssetLoader(type)
  {
    if (typeof type !== 'string') throw new Error("Asset type must be a string");
    if (!this._loaders.has(type)) throw new Error("Cannot find registered loader for type \'" + type + "\'");

    return this._loaders.get(type);
  }

  getAsset(type, url)
  {
    const loader = this.getAssetLoader(type);

    //Will try to load the resource if not already loaded...
    return loader.getAsset(url);
  }

  getAssetImmediately(type, url)
  {
    const loader = this.getAssetLoader(type);

    //Will return the default asset if not yet loaded...
    return loader.getAssetImmediately(url);
  }

  loadAsset(type, url, opts=null)
  {
    const loader = this.getAssetLoader(type);

    //Will return a promise for the final loaded asset...
    return loader.load(url, opts);
  }

  unloadAsset(type, url)
  {
    const loader = this.getAssetLoader(type);

    loader.unload(url);
  }

  cacheAsset(type, url, asset)
  {
    if (typeof asset === 'undefined') throw new Error("Asset must exist to cache");
    const loader = this.getAssetLoader(type);

    loader.cache(url, asset);
  }

  loadManifest(manifest, ignoreErrors=false)
  {
    const assetList = manifest.toAssetDataList();
    const promises = [];

    for(const assetData of assetList)
    {
      //Refer to AssetManifest.js for assetData structure
      const assetType = assetData[0];
      const assetUrl = assetData[1];
      const assetOpts = assetData[2];

      const loader = this.getAssetLoader(assetType);
      let promise = loader.load(assetUrl, assetOpts);
      if (ignoreErrors)
      {
        promise = promise.catch((error) => console.error("Ignoring load error: " + error));
      }
      promises.push(promise);
    }

    //Load all resources in a bundle
    return Promise.all(promises);
  }
}

export default AssetManager;
