import Drawable from './Drawable.js';
import Sprite from './Sprite.js';

class SpriteSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
  }

  update(dt)
  {
    const sprites = this.entityManager.getComponents(Sprite);
    for(let sprite of sprites)
    {
      const entity = sprite.entityID;
      const drawable = this.entityManager.getComponentFromEntity(Drawable, entity);
      if (drawable)
      {
        sprite.spriteIndexOffset += sprite.spriteSpeed * dt;
        sprite.spriteIndexOffset %= sprite.spriteLength;

        const spriteSheet = sprite.spriteSheet;
        if (spriteSheet)
        {
          const spriteIndex = sprite.getSpriteIndex();
          spriteSheet.getSpriteUV(spriteIndex, drawable.textureOffset);
          spriteSheet.getSpriteSize(spriteIndex, drawable.textureScale);

          drawable.textureScale[0] = spriteSheet.getTextureWidth() / drawable.textureScale[0];
          drawable.textureScale[1] = spriteSheet.getTextureHeight() / drawable.textureScale[1];
        }
      }
    }
  }
}

export default SpriteSystem;
