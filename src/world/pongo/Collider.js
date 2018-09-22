import Component from 'entity/Component.js';

import { mat4 } from 'gl-matrix';

import ShapeAABB from './ShapeAABB.js';

class Collider extends Component
{
  //Override
  onComponentCreate(component, entityID)
  {
    component.shape = new ShapeAABB(0, 0, 1, 1);
    component.solid = true;
    component.reflect = false;
  }

  //Override
  onComponentDestroy(component, entityID)
  {
    component.shape = undefined;
    component.solid = undefined;
    component.reflect = undefined;
  }
}

const INSTANCE = new Collider();
export default INSTANCE;
