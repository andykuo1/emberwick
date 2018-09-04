import SystemManager from './SystemManager.js';
import ComponentManager from './ComponentManager.js';
import EntitySystem from './entity/EntitySystem.js';

class EntityManager extends SystemManager
{
  constructor()
  {
    super();

    this.nextEntityID = 1;

    this.components = new Map();
    this.entities = new Set();
    this.tags = new Map();

    //For hybrid object-orientated entity class
    this.addSystem("entity", new EntitySystem());
  }

  clear()
  {
    super.clear();

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
      //Remove from custom entities (if exists)
      if (this.isCustomEntity(entityID))
      {
        const customEntity = this.getCustomEntity(entityID);
        if (!customEntity.isDead())
        {
          customEntity.setDead();
          customEntity.onDestroy();
        }
      }

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
        componentManager.destroyComponent(entityID);
      }

      return true;
    }
    else
    {
      return false;
    }
  }

  getCustomEntity(entityID)
  {
    return this.getSystem("entity").getEntityByID(entityID);
  }

  isCustomEntity(entityID)
  {
    return this.getSystem("entity").hasEntityByID(entityID);
  }

  addComponentToEntity(entityID, componentClass, callback=null)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    //Will create or reset the component instance for entity with id
    const result = componentManager.createComponent(entityID);

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

    return componentManager.destroyComponent(entityID);
  }

  getComponentFromEntity(componentClass, entityID)
  {
    const componentManager = this.components.get(componentClass);
    if (!componentManager)
    {
      throw new Error("Unable to find registered component manager for class \'" + componentClass + "\'");
    }

    return componentManager.getComponent(entityID);
  }

  getComponentsFromTag(componentClass, tag)
  {
    const result = [];
    if (this.tags.has(tag))
    {
      let component;
      const taglist = this.tags.get(tag);
      for(const entityID of taglist)
      {
        component = this.getComponentFromEntity(componentClass, entityID);
        if (component)
        {
          result.push(component);
        }
      }
    }
    return result;
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
      const component = componentManager.getComponent(entityID);
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
