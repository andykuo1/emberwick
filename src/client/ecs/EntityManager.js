import EntityBuilder from './EntityBuilder.js';
import ComponentManager from './ComponentManager.js';

const INITIAL_ENTITY_ID = 1;

class EntityManager
{
  constructor()
  {
    this.entityBuilder = new EntityBuilder(this);
    this.nextEntityID = INITIAL_ENTITY_ID;

    this.entities = [];
    this.components = new Map();
  }

  clear() {
    this.nextEntityID = INITIAL_ENTITY_ID;
    this.entities.length = 0;

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

  createEntity()
  {
    const entityID = this.getNextAvailableEntityID();
    this.entities.push(entityID);
    return entityID;
  }

  destroyEntity(entityID)
  {
    for(const componentManager of this.components.values())
    {
      componentManager.destroyComponentForEntity(entityID);
    }
  }

  addComponentToEntity(entityID, componentClass, resetExisting=false)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    const component = componentManager.getComponentForEntity(entityID);
    //Component already added and not trying to reset
    if (component && !resetExisting)
    {
      throw new Error("Trying to add dupe component \'" + componentClass + "\' for entity \'" + entityID + "\'");
    }

    //Will create or reset the component instance for entity with id
    componentManager.createComponentForEntity(entityID);
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

  getNextAvailableEntityID()
  {
    return this.nextEntityID++;
  }
}

export default EntityManager;
