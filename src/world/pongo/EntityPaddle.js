import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';
import Collider from './Collider.js';

class EntityPaddle extends Entity
{
  constructor(world, offsetX=0)
  {
    super();

    this.world = world;
    this.offsetX = offsetX;
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.addComponent(Drawable);
    drawable.mesh = "cube.mesh";
    const transform = this.addComponent(Transform);
    transform.position[0] = this.offsetX;
    transform.scale[1] = 4;
    const motion = this.addComponent(Motion);
    const collider = this.addComponent(Collider);
    collider.shape.position[0] = transform.position[0];
    collider.shape.position[1] = transform.position[1];
    collider.shape.halfWidth = transform.scale[0] / 2;
    collider.shape.halfHeight = transform.scale[1] / 2;
  }
}

export default EntityPaddle;
