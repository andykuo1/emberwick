import AssetLoader from './AssetLoader.js';

class TextLoader extends AssetLoader
{
  constructor(url)
  {
    super(url, "text");
  }

  processResponse(response)
  {
    return Promise.resolve(response);
  }
}

export default AssetLoader;
