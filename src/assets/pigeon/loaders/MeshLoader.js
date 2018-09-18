import CacheLoader from '../CacheLoader.js';
import Mesh from 'render/mogli/Mesh.js';

class MeshLoader extends CacheLoader
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
      if (!opts.geometry) throw new Error("Missing required argument to load asset \'" + url + "\'");

      const gl = this.gl;
      const geometry = opts.geometry;

      this.assetManager.getAsset("obj", geometry)
        .then((response) => {
          const result = new Mesh(gl);
          result.addAttribute("a_position", response.positions, 3);
          result.addAttribute("a_texcoord", response.texcoords, 2);
          result.addAttribute("a_normal", response.normals, 3);
          result.setElementAttribute(response.indices);
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
