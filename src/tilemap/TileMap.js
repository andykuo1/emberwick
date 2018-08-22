const SIZE = 16;

class TileMap
{
  constructor()
  {
    this._map = new Uint8Array(SIZE * SIZE);
  }

  get map() { return this._map; }

  setTile(x, y, tileID)
  {
    this._map[x + y * SIZE] = tileID;
  }

  getTile(x, y)
  {
    return this._map[x + y * SIZE];
  }
}
TileMap.SIZE = SIZE;

export default TileMap;
