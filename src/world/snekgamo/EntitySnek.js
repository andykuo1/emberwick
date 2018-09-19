import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';

class EntitySnek extends Entity
{
  constructor(world)
  {
    this.world = world;
  }

  onCreate(entityManager)
  {
    super.onCreate(entityManager);

    const drawable = this.addComponent(Drawable);
    drawable.material = "rock.tex";
  }

  onUpdate(dt)
  {
    super.onUpdate(dt);
  }

  onDestroy()
  {
    super.onDestroy();
  }
}

export default EntitySnek;
