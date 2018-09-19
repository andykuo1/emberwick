import { vec3 } from 'gl-matrix';

import Component from 'entity/Component.js';

import { EPSILON } from 'util/MathHelper.js';

class Motion extends Component
{
  //Override
  onComponentCreate(component, entityID)
  {
    component.moveVector = vec3.create();
    component.moveSpeed = 0.6;
    component.isMoving = function()
    {
      return vec3.squaredLength(this.moveVector) > EPSILON;
    }.bind(component);
  }

  //Override
  onComponentDestroy(component, entityID)
  {
    component.moveVector = undefined;
    component.moveSpeed = undefined;
    component.isMoving = undefined;
  }
}

const INSTANCE = new Motion();
export default INSTANCE;
