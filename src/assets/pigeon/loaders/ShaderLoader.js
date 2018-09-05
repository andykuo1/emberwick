import CacheLoader from '../CacheLoader.js';
import Shader from 'render/mogli/Shader.js';

class ShaderLoader extends CacheLoader
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
      if (!opts.vertexShader) throw new Error("Missing required argument to load asset \'" + url + "\'");
      if (!opts.fragmentShader) throw new Error("Missing required argument to load asset \'" + url + "\'");

      const gl = this.gl;
      const vertexShader = opts.vertexShader;
      const fragmentShader = opts.fragmentShader;

      this.assetManager.getAsset("vert", vertexShader).then((vertexResult) => {
        this.assetManager.getAsset("frag", fragmentShader).then((fragmentResult) => {
          const result = new Shader(gl, vertexResult, fragmentResult);
          result.setLayout("a_position", 3, gl.FLOAT, false);
          result.setLayout("a_texcoord", 2, gl.FLOAT, false);
          result.setLayout("a_normal", 3, gl.FLOAT, false);
          resolve(result);
        });
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

export default ShaderLoader;
