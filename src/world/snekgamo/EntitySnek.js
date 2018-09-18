import Entity from 'entity/Entity.js';

class EntitySnek extends Entity
{
  constructor(world)
  {
    this.world = world;
  }

  onCreate(entityManager)
  {
    super.onCreate(entityManager);

    this.addComponent()
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
