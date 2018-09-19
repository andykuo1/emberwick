class Entity
{
  constructor()
  {
    this.entityManager = null;
    this.entityID = -1;
    this._dead = false;
  }

  setEntityID(entityID)
  {
    this.entityID = entityID;
  }

  onCreate(entityManager)
  {
    this.entityManager = entityManager;
  }

  onEarlyUpdate(dt) {}

  onUpdate(dt) {}

  onLateUpdate(dt) {}

  onDestroy() {}

  addComponent(componentClass)
  {
    return this.entityManager.addComponentToEntity(this.entityID, componentClass);
  }

  removeComponent(componentClass)
  {
    return this.entityManager.removeComponentFromEntity(this.entityID, componentClass);
  }

  getComponent(componentClass)
  {
    return this.entityManager.getComponentFromEntity(componentClass, this.entityID);
  }

  getEntityID()
  {
    return this.entityID;
  }

  setDead()
  {
    this._dead = true;
  }

  isDead()
  {
    return this._dead;
  }
}

export default Entity;
