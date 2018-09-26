const ALLOCATION_CACHE_SIZE = 10;

class ComponentManager
{
  constructor(componentClass)
  {
    this.componentClass = componentClass;
    this.componentInstances = new Map();
    this.cached = [];
  }

  createComponent(entityID)
  {
    let result = this.componentInstances.get(entityID);
    if (result)
    {
      this.componentClass.onComponentDestroy(result, entityID);

      result.entityID = entityID;
      this.componentClass.onComponentCreate(result, entityID);
    }
    else
    {
      result = this.allocateComponent();
      
      result.entityID = entityID;
      this.componentClass.onComponentCreate(result, entityID);
      this.componentInstances.set(entityID, result);
    }
    return result;
  }

  destroyComponent(entityID)
  {
    const result = this.componentInstances.get(entityID);
    if (result)
    {
      this.componentInstances.delete(entityID);
      this.componentClass.onComponentDestroy(result, entityID);

      this.deallocateComponent(result);
      return true;
    }

    return false;
  }

  getComponent(entityID)
  {
    return this.componentInstances.get(entityID);
  }

  getComponents()
  {
    return this.componentInstances.values();
  }

  getEntities()
  {
    return this.componentInstances.keys();
  }

  allocateComponent()
  {
    if (this.cached.length <= 0)
    {
      //Allocate more components
      for(let i = ALLOCATION_CACHE_SIZE; i >= 0; --i)
      {
        this.cached.push({ entityID: -1 });
      }
    }

    return this.cached.pop();
  }

  deallocateComponent(component)
  {
    component.entityID = -1;

    //Add the object back into cache
    this.cached.push(component);
  }

  clearCache()
  {
    this.cached.length = 0;
  }

  clear()
  {
    for(const component of this.componentInstances.values())
    {
      this.deallocateComponent(component);
    }

    this.componentInstances.clear();
  }
}

export default ComponentManager;
