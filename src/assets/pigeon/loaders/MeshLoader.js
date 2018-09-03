import CacheLoader from '../CacheLoader.js';
import Mesh from 'render/mogli/Mesh.js';

class MeshLoader extends CacheLoader
{
  constructor(assetManager)
  {
    super(assetManager);
  }

  //Override
  onLoadResource(resource, opts, url)
  {
    return new Promise((resolve, reject) => {
      if (!opts.gl) throw new Error("Missing required argument to load asset \'" + url + "\'");
      if (!opts.geometry) throw new Error("Missing required argument to load asset \'" + url + "\'");

      const gl = opts.gl;
      const geometry = opts.geometry;

      this.assetManager.getAsset("obj", geometry)
        .then((response) => {
          const result = new Mesh(gl, gl.TRIANGLES,
            response.positions,
            response.texcoords,
            response.normals,
            response.indices
          );
          resolve(result);
        })
        .catch((error) => {
          reject(error);
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

export default MeshLoader;
