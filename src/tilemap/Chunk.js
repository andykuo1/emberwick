const CHUNKSIZE = 16;

class Chunk
{
  constructor(chunkManager, chunkX, chunkY)
  {
    this.chunkManager = chunkManager;
    this.chunkX = chunkX;
    this.chunkY = chunkY;

    this.lastActiveTime = this.chunkManager.getCurrentChunkTime();

    this.tiles = new Uint8Array(CHUNKSIZE * CHUNKSIZE);
    for(let i = 0; i < this.tiles.length; ++i)
    {
      this.tiles[i] = Math.round(Math.random() * 255);
    }
  }

  indexOf(coordX, coordY)
  {
    return (coordX % CHUNKSIZE) + (coordY % CHUNKSIZE) * CHUNKSIZE;
  }

  getLastActiveTime()
  {
    return this.lastActiveTime;
  }

  getElapsedActiveTime()
  {
    return this.chunkManager.getCurrentChunkTime() - this.lastActiveTime;
  }
}
Chunk.SIZE = CHUNKSIZE;

export default Chunk;
