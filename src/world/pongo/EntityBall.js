import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

class EntityBall extends Entity
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

    const drawable = this.addComponent(Drawable)
    drawable.mesh = "ball.mesh";
    this.addComponent(Transform);
    this.addComponent(Motion);
  }
}

export default EntityBall;
