import { vec3 } from 'gl-matrix';

import EntityLiving from './EntityLiving.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

class EntitySnekBody extends EntityLiving
{
  constructor(world, parent)
  {
    super(world);

    this.parent = parent;

    this.maxDistance = 1;
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.getComponent(Drawable);
    drawable.mesh = "quad.mesh";
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    if (this.parent instanceof EntityLiving)
    {
      const parentTransform = this.parent.getComponent(Transform);
      const parentMotion = this.parent.getComponent(Motion);
      const transform = this.getComponent(Transform);
      const motion = this.getComponent(Motion);

      if (vec3.squaredDistance(transform.position, parentTransform.position) > this.maxDistance)
      {
        vec3.sub(motion.moveVector, parentTransform.position, transform.position);
        const dist = vec3.squaredLength(motion.moveVector);
        vec3.normalize(motion.moveVector, motion.moveVector);
        vec3.scale(motion.moveVector, motion.moveVector, motion.moveSpeed * (dist / 2));
      }
      else
      {
        vec3.set(motion.moveVector, 0, 0, 0);
      }
    }
  }
}

export default EntitySnekBody;
