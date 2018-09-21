import Component from 'entity/Component.js';

class PhysicBody extends Component
{
  onComponentCreate(component, entityID)
  {
    component.entityID = entityID;
  }

  onComponentDestroy(component, entityID)
  {
    component.entityID = undefined;
  }
}

export default PhysicBody;
