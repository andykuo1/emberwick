import { vec2 } from 'gl-matrix';

class SpriteSheet
{
  constructor(texture, width, height, spriteWidth=width, spriteHeight=height)
  {
    this.texture = texture;
    this.width = width;
    this.height = height;

    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;

    this.spriteRowLength = width / spriteWidth;
    this.spriteColLength = height / spriteHeight;
  }

  getSpriteUV(index, dst=vec2.create())
  {
    const spriteX = index % this.spriteRowLength;
    const spriteY = Math.floor(index / this.spriteRowLength);
    dst[0] = spriteX / this.spriteRowLength;
    dst[1] = spriteY / this.spriteColLength;
    return dst;
  }

  getSpriteSize(index, dst=vec2.create())
  {
    dst[0] = this.spriteWidth;
    dst[1] = this.spriteHeight;
    return dst;
  }

  getTextureWidth()
  {
    return this.width;
  }

  getTextureHeight()
  {
    return this.height;
  }
}

export default SpriteSheet;
