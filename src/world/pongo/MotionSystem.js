import { vec3 } from 'gl-matrix';

import Motion from './Motion.js';
import Transform from './Transform.js';

class MotionSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
  }

  onUpdate(dt)
  {
    const entities = this.entityManager.getEntitiesByComponent(Motion);
    for(const entity of entities)
    {
      const motion = this.entityManager.getComponentFromEntity(Motion, entity);
      if (motion)
      {
        motion.moveSpeed *= dt;
      }
    }
  }

  onLateUpdate(dt)
  {
    const entities = this.entityManager.getEntitiesByComponent(Motion);
    for(const entity of entities)
    {
      const motion = this.entityManager.getComponentFromEntity(Motion, entity);
      const transform = this.entityManager.getComponentFromEntity(Transform, entity);
      if (motion && transform)
      {
        vec3.scaleAndAdd(transform.position, transform.position, motion.moveVector, motion.moveSpeed);
      }
    }
  }
}

export default MotionSystem;
