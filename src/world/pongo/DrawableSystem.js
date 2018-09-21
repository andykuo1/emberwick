import Drawable from './Drawable.js';
import Transform from './Transform.js';

class DrawableSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
  }

  onLateUpdate(dt)
  {
    const entities = this.entityManager.getEntitiesByComponent(Drawable);
    for(const entity of entities)
    {
      const drawable = this.entityManager.getComponentFromEntity(Drawable, entity);
      const transform = this.entityManager.getComponentFromEntity(Transform, entity);
      if (drawable && transform)
      {
        transform.toMatrix(drawable.transform);
      }
    }
  }
}

export default DrawableSystem;
