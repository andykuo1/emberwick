import System from 'ecs/System.js';

const MAX_CREATE_EVENTS = 100;

class EntitySystem extends System
{
  constructor()
  {
    super();

    this.entities = new Map();
    this.destroyCache = [];
    this.createQueue = [];
    this.createCache = [];
    this._useCache = false;
  }

  initialize()
  {
    super.initialize();
  }

  terminate()
  {
    super.terminate();

    this.destroyCache.length = 0;
    this.createCache.length = 0;
    this.createQueue.length = 0;

    for(const entity of this.entities.values())
    {
      entity.onDestroy();
      entity.setEntityID(-1);
    }
    this.entities.clear();
  }

  update(dt)
  {
    super.update(dt);

    this._useCache = true;
    let flag = this.createQueue.length > 0;
    let steps = MAX_CREATE_EVENTS;
    while(flag)
    {
      while(this.createQueue.length > 0 && flag)
      {
        const entity = this.createQueue.shift();
        if (entity.getEntityID() !== -1) throw new Error("Entity is already created by another manager");

        const entityID = this.entityManager.createEntity("entity");
        entity.setEntityID(entityID);
        entity.onCreate(this.entityManager);
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
      entity.setEntityID(-1);
      this.entities.delete(entityID);
    }
    this.destroyCache.length = 0;
  }

  addEntity(entity)
  {
    if (this._useCache)
    {
      this.createCache.unshift(entity);
    }
    else
    {
      this.createQueue.unshift(entity);
    }
    return entity;
  }

  removeEntity(entity)
  {
    entity.setDead();
    return entity;
  }

  hasEntity(entity)
  {
    return this.entities.has(entity.getEntityID());
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
    return this.entities;
  }
}

export default EntitySystem;
