import CacheLoader from '../CacheLoader.js';
import Texture from 'render/mogli/Texture.js';

class TextureLoader extends CacheLoader
{
  constructor(assetManager, gl)
  {
    super(assetManager);

    this.gl = gl;
  }

  //Override
  onLoadResource(resource, opts, url)
  {
    return new Promise((resolve, reject) => {
      if (!opts.image) throw new Error("Missing required argument to load asset \'" + url + "\'");

      const gl = this.gl;
      const image = opts.image;
      const wrapMode = opts.wrapMode;
      const minMagFilter = opts.minMagFilter;

      this.assetManager.getAsset("image", image).then((imageResult) => {
        const result = new Texture(gl, wrapMode, minMagFilter);
        result.setData(imageResult);
        resolve(result);
      });
    });
  }

  //Override
  onUnloadResource(resource, url)
  {
    if (resource)
    {
      resource.delete();
    }
  }
}

export default TextureLoader;
