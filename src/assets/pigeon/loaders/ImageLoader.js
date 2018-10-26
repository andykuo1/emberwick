import AssetLoader from '../AssetLoader.js';

class ImageLoader extends AssetLoader
{
  constructor(assetManager, baseUrl)
  {
    super(assetManager, baseUrl, "blob");
  }

  //Override
  onLoadResource(resource, opts, url)
  {
    return new Promise((resolve, reject) => {
      const imageURL = URL.createObjectURL(resource);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(imageURL);
        
        //Flip image vertically to match OpenGL
        const result = createImageBitmap(image, 0, 0, image.width, image.height, {imageOrientation: "flipY"});

        resolve(result);
      };
      image.onerror = () => {
        URL.revokeObjectURL(imageURL);
        reject(new Error("Unable to load image"));
      };
      image.src = imageURL;
    });
  }
}

export default ImageLoader;
