import { vec3 } from 'gl-matrix';
import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

class EntityLiving extends Entity
{
  constructor(world)
  {
    super();

    this.world = world;
  }

  //Override
  onCreate(entityManager)
  {
    super.onCreate(entityManager);

    this.addComponent(Drawable);
    this.addComponent(Transform);
    this.addComponent(Motion);
  }

  //Override
  onLateUpdate(dt)
  {
    super.onLateUpdate(dt);

    const transform = this.getComponent(Transform);

    //Update transform by motion
    const motion = this.getComponent(Motion);
    vec3.scaleAndAdd(transform.position, transform.position, motion.moveVector, motion.moveSpeed * dt);

    //Update drawable position
    const drawable = this.getComponent(Drawable);
    transform.toMatrix(drawable.transform);
  }
}

export default EntityLiving;
