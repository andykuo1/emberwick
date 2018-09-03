import AssetLoader from '../AssetLoader.js';

class TextLoader extends AssetLoader
{
  constructor(assetManager, baseUrl)
  {
    super(assetManager, baseUrl, "text");
  }
}

export default TextLoader;
