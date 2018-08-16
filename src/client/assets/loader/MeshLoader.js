import LocalAssetLoader from './LocalAssetLoader.js';
import Mesh from 'render/mogli/Mesh.js';

class MeshLoader extends LocalAssetLoader
{
  constructor(url)
  {
    super(url, "gl");
  }

  //Override
  fetch(gl, assets, geometryAsset)
  {
    if (!gl || !assets || !geometryAsset) throw new Error("Missing required argument to load asset \'" + this.url + "\'");

    //Starting to process request...
    this.request = true;

    this._onProgress(0, 1);
    return assets.getAsset(geometryAsset, false).then((assetData) => {
      const result = new Mesh(gl, gl.TRIANGLES,
        assetData.positions,
        assetData.texcoords,
        assetData.normals,
        assetData.indices);

      this._onProgress(1, 1);
      return this.processResponse(result)
        .then((response) => {
          this._onLoad(response);
          this._onStop();
          this.request = null;
          return result;
        });
    })
    .catch((error) => {
      this._onStop();
      this.request = null;

      this._onError(error);
      throw error;
    });
  }

  //Override
  unload(data)
  {
    super.unload(data);

    data.delete();
  }
}

export default MeshLoader;
