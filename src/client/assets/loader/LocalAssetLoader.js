import AssetLoader from './AssetLoader.js';

class LocalAssetLoader extends AssetLoader
{
  constructor(url, type="offline")
  {
    super(url, type);
  }

  //Override
  abort()
  {
    throw new Error("Unable to abort offline asset loader");
  }
}

export default LocalAssetLoader;
