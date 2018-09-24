import Entity from 'entity/Entity.js';

import { vec3, mat4 } from 'gl-matrix';
import Drawable from './Drawable.js';

class EntityParticle extends Entity
{
  constructor(world, x=0, y=0)
  {
    super();

    this.world = world;
    this.x = x;
    this.y = y;
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.addComponent(Drawable);
    mat4.fromTranslation(drawable.transform, vec3.fromValues(this.x, this.y, 0));
  }
}

export default EntityParticle;
