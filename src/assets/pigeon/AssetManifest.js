const ASSET_TYPE = 0;
const ASSET_URL = 1;
const ASSET_OPTS = 2;

class AssetManifest
{
  constructor()
  {
    this._assets = [];
  }

  clear()
  {
    this._assets.length = 0;
  }

  addAsset(type, url, opts=null)
  {
    if (typeof type !== 'string') throw new Error("Asset type must be a string");

    this._assets.push([type, url, opts]);
  }

  removeAsset(type, url)
  {
    let assetIndex = -1;
    const length = this._assets.length;
    for(let i = 0; i < lenght; ++i)
    {
      if (assetData[ASSET_TYPE] === type && assetData[ASSET_URL] === url)
      {
        assetIndex = i;
        break;
      }
    }
    if (assetIndex > 0)
    {
      this._assets.splice(assetIndex, 1);
    }
    else
    {
      throw new Error("Cannot find manifest asset data of type \'" + type + "\' with url \'" + url + "\'");
    }
  }

  toAssetDataList()
  {
    return this._assets.slice();
  }
}

export default AssetManifest;
