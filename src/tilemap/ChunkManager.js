import Chunk from './Chunk.js';
import TilePos from './TilePos.js';

import { hash2D } from 'util/MathHelper.js';

const MAX_INACTIVE_TIME = 5000;

class ChunkManager
{
  constructor()
  {
    this.chunks = new Map();
    this.nullChunk = new Chunk(this);

    this.cursor = new TilePos(this);
  }

  update()
  {
    const currentTime = this.getCurrentChunkTime();
    for(let [key, chunk] of this.chunks)
    {
      if (currentTime - chunk.getLastActiveTime() > MAX_INACTIVE_TIME)
      {
        this.chunks.delete(key);
      }
      else
      {
        chunk.update();
      }
    }
  }

  getCursor()
  {
    return this.cursor;
  }

  getChunk(chunkCoordX, chunkCoordY, isActive=true)
  {
    const chunkHash = hash2D(chunkCoordX, chunkCoordY);
    if (this.chunks.has(chunkHash))
    {
      const chunk = this.chunks.get(chunkHash);
      if (isActive)
      {
        chunk.setActiveTime(this.getCurrentChunkTime());
      }
      return chunk;
    }
    else
    {
      if (isActive)
      {
        return this.loadChunk(chunkCoordX, chunkCoordY);
      }
      else
      {
        return this.nullChunk;
      }
    }
  }

  loadChunk(chunkCoordX, chunkCoordY)
  {
    const chunkHash = hash2D(chunkCoordX, chunkCoordY);
    if (this.chunks.has(chunkHash))
    {
      throw new Error("Found chunk already loaded at (" + chunkCoordX + ", " + chunkCoordY + ")");
    }
    else
    {
      const chunk = new Chunk(chunkCoordX, chunkCoordY);
      chunk.setActiveTime(this.getCurrentChunkTime());
      this.chunks.set(chunkHash, chunk);
      return chunk;
    }
  }

  unloadChunk(chunkCoordX, chunkCoordY)
  {
    const chunkHash = hash2D(chunkCoordX, chunkCoordY);
    if (this.chunks.has(chunkHash))
    {
      const chunk = this.chunks.get(chunkHash);
      this.chunks.delete(chunkHash);
      return chunk;
    }
    else
    {
      throw new Error("Cannot find loaded chunk at (" + chunkCoordX + ", " + chunkCoordY + ")");
    }
  }

  isChunkLoaded(chunkCoordX, chunkCoordY)
  {
    const chunkHash = hash2D(chunkCoordX, chunkCoordY);
    return this.chunks.has(chunkHash);
  }

  getCurrentChunkTime()
  {
    return Date.now();
  }
}

export default ChunkManager;
