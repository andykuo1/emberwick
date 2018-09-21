import { vec3 } from 'gl-matrix';

import Motion from './Motion.js';
import Transform from './Transform.js';

class MotionSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
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
        vec3.scaleAndAdd(transform.position, transform.position, motion.moveVector, motion.moveSpeed * dt);
      }
    }
  }
}

export default MotionSystem;
