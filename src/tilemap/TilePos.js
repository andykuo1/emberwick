import { CHUNK_SIZE, TILE_SIZE } from './Chunk.js';

class TilePos
{
  constructor(chunkManager)
  {
    this.chunkManager = chunkManager;

    this.chunk = null;
    this.chunkCoordX = 0;
    this.chunkCoordY = 0;
    this.tileCoordX = 0;
    this.tileCoordY = 0;
  }

  setWorldPosition(posX, posY)
  {
    posX = Math.floor(posX / TILE_SIZE);
    posY = Math.floor(posY / TILE_SIZE);
    this.chunkCoordX = Math.floor(posX / CHUNK_SIZE);
    this.chunkCoordY = Math.floor(posY / CHUNK_SIZE);
    this.tileCoordX = posX % CHUNK_SIZE;
    this.tileCoordY = posY % CHUNK_SIZE;

    this.chunk = this.chunkManager.getChunk(this.chunkCoordX, this.chunkCoordY);
    return this;
  }

  move(dx=0, dy=0)
  {
    if (dx != 0)
    {
      this.tileCoordX += dx % CHUNK_SIZE;
      this.chunkCoordX += Math.floor(this.tileCoordX / CHUNK_SIZE);
    }

    if (dy != 0)
    {
      this.tileCoordY += dy % CHUNK_SIZE;
      this.chunkCoordY += Math.floor(this.tileCoordY / CHUNK_SIZE);
    }

    this.chunk = this.chunkManager.getChunk(this.chunkCoordX, this.chunkCoordY);
    return this;
  }

  setTile(tile)
  {
    this.chunk.setTile(this.tileCoordX, this.tileCoordY, tile);
    return this;
  }

  getTile()
  {
    return this.chunk.getTile(this.tileCoordX, this.tileCoordY);
  }

  getChunk()
  {
    return this.chunk;
  }
}
export default TilePos;
