import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

class EntityPaddle extends Entity
{
  constructor(world, offsetX=0)
  {
    super();

    this.world = world;
    this.offsetX = offsetX;
  }

  //Override
  onCreate(entityManager)
  {
    super.onCreate(entityManager);

    const drawable = this.addComponent(Drawable);
    drawable.mesh = "cube.mesh";
    const transform = this.addComponent(Transform);
    transform.position[0] = this.offsetX;
    transform.scale[1] = 4;
    const motion = this.addComponent(Motion);
    motion.moveSpeed = 1;
  }
}

export default EntityPaddle;
