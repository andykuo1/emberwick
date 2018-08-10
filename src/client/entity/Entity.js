class Entity
{
  onCreate(entityManager, entityID, ...args)
  {
    //Setup components for entity
  }

  onDestroy(entityManager, entityID)
  {
    //Cleanup components for entity
  }

  getClassID()
  {
    return "entity";
  }
}

export default new Entity();
