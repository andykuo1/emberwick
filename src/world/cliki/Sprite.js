import Component from 'entity/Component.js';

class Sprite extends Component
{
  //Override
  onComponentCreate(component, entityID)
  {
    component.spriteSheet = null;
    component.spriteIndex = 0;
    component.spriteIndexOffset = 0;
    component.spriteSpeed = 1;
    component.spriteLength = 0;
    component.getSpriteIndex = function() {
      return Math.floor(component.spriteIndex + component.spriteIndexOffset);
    };
  }

  //Override
  onComponentDestroy(component, entityID)
  {
    component.spriteSheet = undefined;
    component.spriteIndex = undefined;
    component.spriteIndexOffset = undefined;
    component.spriteSpeed = undefined;
    component.spriteLength = undefined;
    component.getSpriteIndex = undefined;
  }
}

const INSTANCE = new Sprite();
export default INSTANCE;
