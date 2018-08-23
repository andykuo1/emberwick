import ComponentManager from './ComponentManager.js';

class EntityManager
{
  constructor()
  {
    this.nextEntityID = 1;

    this.components = new Map();
    this.entities = new Set();
    this.tags = new Map();
  }

  clear()
  {
    this.entities.clear();
    this.tags.clear();

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

  createEntity(...tags)
  {
    const entityID = this.getNextAvailableEntityID();

    //Add to the general entity list
    this.entities.add(entityID);

    //Add to all entity list tags
    let taglist;
    for(const tag of tags)
    {
      this.addTagToEntity(entityID, tag);
    }

    return entityID;
  }

  destroyEntity(entityID)
  {
    if (this.entities.has(entityID))
    {
      //Remove from general entity list
      this.entities.delete(entityID);

      //Remove from all tag lists
      for(const taglist of this.tags.values())
      {
        if (taglist.has(entityID))
        {
          taglist.delete(entityID);
        }
      }

      //Remove all components
      for(const componentManager of this.components.values())
      {
        componentManager.destroyComponentForEntity(entityID);
      }

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

  addTagToEntity(entityID, tag)
  {
    let taglist = this.tags.get(tag);
    if (!taglist) this.tags.set(tag, taglist = new Set());
    taglist.add(entityID);
  }

  removeTagFromEntity(entityID, tag)
  {
    let taglist = this.tags.get(tag);
    if (taglist && taglist.has(entityID))
    {
      taglist.delete(entityID);
    }
  }

  getEntitiesByTag(tag)
  {
    return this.tags.get(tag);
  }

  getEntities()
  {
    return this.entities;
  }

  getNextAvailableEntityID()
  {
    return this.nextEntityID++;
  }
}

export default EntityManager;
