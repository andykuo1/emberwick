import ComponentManager from './ComponentManager.js';

const INITIAL_ENTITY_ID = 1;

class EntityManager
{
  constructor()
  {
    this.nextEntityID = INITIAL_ENTITY_ID;

    this.components = new Map();
    this.entities = new Map();
  }

  clear() {
    this.nextEntityID = INITIAL_ENTITY_ID;
    this.entities.clear();

    for(const componentManager of this.components.values())
    {
      componentManager.clear();
    }
  }

  registerComponentClass(componentClass)
  {
    if (this.components.has(componentClass))
    {
      throw new Error("Already registered component for \'" + componentClass + "\'");
    }

    this.components.set(componentClass, new ComponentManager(componentClass));
  }

  unregisterComponentClass(componentClass)
  {
    if (!this.components.has(componentClass))
    {
      throw new Error("Cannot find registered component for \'" + componentClass + "\'");
    }

    this.components.delete(componentClass);
  }

  createEntity(entityClass, ...args)
  {
    const entityID = this.getNextAvailableEntityID();
    this.entities.set(entityID, entityClass);

    entityClass.onCreate(this, entityID, ...args);
    return entityID;
  }

  destroyEntity(entityID)
  {
    const entity = this.entities.get(entityID);
    if (entity)
    {
      entity.onDestroy(this, entityID);

      for(const componentManager of this.components.values())
      {
        componentManager.destroyComponentForEntity(entityID);
      }

      this.entities.delete(entityID);
      return true;
    }
    else
    {
      return false;
    }
  }

  addComponentToEntity(entityID, componentClass, callback=null)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    //Will create or reset the component instance for entity with id
    const result = componentManager.createComponentForEntity(entityID);

    if (callback) callback.apply(null, result);
    return result;
  }

  removeComponentFromEntity(entityID, componentClass)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    return componentManager.destroyComponentForEntity(entityID);
  }

  getComponentFromEntity(entityID, componentClass)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    return componentManager.getComponentForEntity(entityID);
  }

  getComponentsByClass(componentClass)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    return componentManager.getComponents();
  }

  getComponentsByEntity(entityID)
  {
    const result = [];
    for(const componentManager of this.components.values())
    {
      const component = componentManager.getComponentForEntity(entityID);
      if (component) result.push(component);
    }
    return result;
  }

  getEntityClassByID(entityID)
  {
    return this.entities.get(entityID);
  }

  getNextAvailableEntityID()
  {
    return this.nextEntityID++;
  }
}

export default EntityManager;
