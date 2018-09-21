import Transform from './Transform.js';
import Motion from './Motion.js';
import PhysicBody from './PhysicBody.js';

class CollisionManager
{
  constructor()
  {
    
  }

  update(entityManager)
  {
    const bodies = entityManager.getComponentsByClass(PhysicBody);

    for(let body of bodies)
    {
      const entityID = body.entityID;
      const transform = entityManager.getComponentFromEntity(Transform, entityID);
      const motion = entityManager.getComponentFromEntity(Motion, entityID);
      if (transform && motion)
      {
        motion.
      }
    }
  }
}
