export const CHUNK_SIZE = 16;
export const TILE_SIZE = 32;
export const BORDER_NORTH = 8;
export const BORDER_WEST = 1;
export const BORDER_SOUTH = 2;
export const BORDER_EAST = 4;
export const BORDER_ALL = 15;

class Chunk
{
  constructor(chunkCoordX, chunkCoordY)
  {
    this.chunkCoordX = chunkCoordX;
    this.chunkCoordY = chunkCoordY;
    this._activeTime = 0;
    this._dirty = false;

    this._tiles = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE);
    this._metas = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE);

    //DEBUG: to fill with random stuff
    for(let i = 0, length = this._tiles.length; i < length; ++i)
    {
      this._tiles[i] = Math.floor((Math.random() * 10));
    }
  }

  update()
  {
    if (this._dirty)
    {
      let metadata;
      let n, s, w, e;
      const length = this._tiles.length;
      for(let i = 0; i < length; ++i)
      {
        if (this._tiles[i] <= 0) continue;

        metadata = 0;
        n = i - CHUNK_SIZE;
        s = i + CHUNK_SIZE;
        w = i - 1;
        e = i + 1;
        if (w >= 0 && w < length && this._tiles[w] <= 0)
        {
          metadata |= 1;
        }
        if (s >= 0 && s < length && this._tiles[s] <= 0)
        {
          metadata |= 2;
        }
        if (e >= 0 && e < length && this._tiles[e] <= 0)
        {
          metadata |= 4;
        }
        if (n >= 0 && n < length && this._tiles[n] <= 0)
        {
          metadata |= 8;
        }
        this._metas[i] = metadata;
      }
    }
  }

  setTile(tileCoordX, tileCoordY, tile)
  {
    if (tileCoordX < 0 || tileCoordX > CHUNK_SIZE) return;
    if (tileCoordY < 0 || tileCoordY > CHUNK_SIZE) return;
    this._tiles[tileCoordX + tileCoordY * CHUNK_SIZE] = tile;
    this._dirty = true;
  }

  setMetadata(tileCoordX, tileCoordY, metadata)
  {
    if (tileCoordX < 0 || tileCoordX > CHUNK_SIZE) return;
    if (tileCoordY < 0 || tileCoordY > CHUNK_SIZE) return;
    this._metas[tileCoordX + tileCoordY * CHUNK_SIZE] = metadata;
    this._dirty = true;
  }

  getTile(tileCoordX, tileCoordY)
  {
    if (tileCoordX < 0 || tileCoordX > CHUNK_SIZE) return 0;
    if (tileCoordY < 0 || tileCoordY > CHUNK_SIZE) return 0;
    return this._tiles[tileCoordX + tileCoordY * CHUNK_SIZE];
  }

  getMetadata(tileCoordX, tileCoordY)
  {
    if (tileCoordX < 0 || tileCoordX > CHUNK_SIZE) return 0;
    if (tileCoordY < 0 || tileCoordY > CHUNK_SIZE) return 0;
    return this._metas[tileCoordX + tileCoordY * CHUNK_SIZE];
  }

  setActiveTime(time)
  {
    this._activeTime = time;
  }

  getLastActiveTime()
  {
    return this._activeTime;
  }
}

export default Chunk;
