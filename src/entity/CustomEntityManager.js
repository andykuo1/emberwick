const MAX_CREATE_EVENTS = 100;

class CustomEntityManager
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    this.entities = new Map();
    this.destroyCache = [];
    this.createQueue = [];
    this.createCache = [];
    this._useCache = false;
  }

  clear()
  {
    this.destroyCache.length = 0;
    this.createCache.length = 0;
    this.createQueue.length = 0;

    //Assumes that entityManager has not yet destroyed all entity references
    for(const entity of this.entities.values())
    {
      const entityID = entity.getEntityID();
      if (this.entityManager.hasEntity(entityID))
      {
        if (entity.isDead())
        {
          entity.onDestroy();
          entity.setEntityID(-1);
        }

        this.entityManager.destroyEntity(entityID);
      }
      else
      {
        //Destruction was already handled
      }
    }
    this.entities.clear();
  }

  update(dt)
  {
    for(const entity of this.entities.values())
    {
      if (!entity.isDead()) entity.onEarlyUpdate(dt);
    }

    this._useCache = true;
    let flag = this.createQueue.length > 0;
    let steps = MAX_CREATE_EVENTS;
    while(flag)
    {
      while(this.createQueue.length > 0 && flag)
      {
        const entity = this.createQueue.shift();
        const entityID = entity.getEntityID();
        if (entityID === -1) throw new Error("Invalid entity id");

        entity.onCreate();
        this.entities.set(entityID, entity);

        if (--steps < 0)
        {
          flag = false;
        }
      }

      if (this.createCache.length > 0)
      {
        for(const entity of this.createCache)
        {
          this.createQueue.unshift(entity);
        }
        this.createCache.length = 0;
      }
      else
      {
        flag = false;
      }
    }
    this._useCache = false;

    for(const entity of this.entities.values())
    {
      if (!entity.isDead())
      {
        entity.onUpdate(dt);
      }
      else
      {
        this.destroyCache.push(entity);
      }
    }

    for(const entity of this.destroyCache)
    {
      const entityID = entity.getEntityID();
      if (this.entityManager.hasEntity(entityID))
      {
        entity.onDestroy();
        if (!entity.isDead()) throw new Error("Entity must be dead after onDestroy");
        this.entityManager.destroyEntity(entityID);
      }
      entity.setEntityID(-1, null);
      this.entities.delete(entityID);
    }
    this.destroyCache.length = 0;

    for(const entity of this.entities.values())
    {
      if (!entity.isDead()) entity.onLateUpdate(dt);
    }
  }

  addEntity(entity)
  {
    if (entity.getEntityID() !== -1) throw new Error("Entity is already created by another manager");

    if (this._useCache)
    {
      this.createCache.unshift(entity);
    }
    else
    {
      this.createQueue.unshift(entity);
    }

    const entityID = this.entityManager.createEntity("entity");
    entity.setEntityID(entityID, this.entityManager);
    return entity;
  }

  hasEntityByID(entityID)
  {
    return this.entities.has(entityID);
  }

  getEntityByID(entityID)
  {
    return this.entities.get(entityID);
  }

  getEntities()
  {
    return this.entities.values();
  }
}

export default CustomEntityManager;
