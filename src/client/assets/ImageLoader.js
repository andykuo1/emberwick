import AssetLoader from './AssetLoader.js';

class ImageLoader extends AssetLoader
{
  constructor(url)
  {
    super(url, "blob");
  }

  processResponse(response)
  {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(response);
      const img = new Image();
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }
}

export default ImageLoader;
