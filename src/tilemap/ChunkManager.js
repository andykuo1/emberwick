import Chunk from './Chunk.js';

class ChunkManager
{
  constructor()
  {
    this.chunkMap = new Map();
  }

  getChunkByPosition(posX, posY, forceLoad=false)
  {
    return this.getChunk(Math.round(posX / Chunk.SIZE), Math.round(posY / Chunk.SIZE), forceLoad);
  }

  getChunk(chunkX, chunkY, forceLoad=false)
  {
    const hash = hash2D(chunkX, chunkY);
    if (this.chunkMap.has(hash))
    {
      return this.chunkMap.get(hash);
    }
    else if (forceLoad)
    {
      //Load chunk
      const chunkData = new Chunk(this, chunkX, chunkY);
      this.chunkMap.set(hash, chunkData);
      return chunkData;
    }
    else
    {
      //Don't load the chunk
      return null;
    }
  }

  getCurrentChunkTime()
  {
    return Date.now();
  }
}

function hash2D(x, y)
{
  return (53 + hashInt(x)) * 53 + hashInt(y);
}

//Robert Jenkin's 32 bit integer hash function
function hashInt(a)
{
  a = (a+0x7ed55d16) + (a<<12);
  a = (a^0xc761c23c) ^ (a>>19);
  a = (a+0x165667b1) + (a<<5);
  a = (a+0xd3a2646c) ^ (a<<9);
  a = (a+0xfd7046c5) + (a<<3);
  a = (a^0xb55a4f09) ^ (a>>16);
  return a;
}

export default ChunkManager;
