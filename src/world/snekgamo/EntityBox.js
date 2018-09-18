import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';

class EntityBox extends Entity
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

    const drawable = this.addComponent(Drawable);
    drawable.mesh = "cube.mesh";
  }
}

export default EntityBox;
