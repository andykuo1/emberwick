import { vec3, quat, mat4 } from 'gl-matrix';

import Component from 'entity/Component.js';

class Transform extends Component
{
  onComponentCreate(component, entityID)
  {
    component.position = vec3.fromValues(0, 0, 0);
    component.scale = vec3.fromValues(1, 1, 1);
    component.pitch = 0;
    component.yaw = 0;
    component.roll = 0;
    component._eulerRotation = quat.create();
    component.toMatrix = function(dst)
    {
      quat.fromEuler(this._eulerRotation, this.pitch, this.yaw, this.roll);
      mat4.fromRotationTranslationScale(dst, this._eulerRotation, this.position, this.scale);
    }.bind(component);
  }

  onComponentDestroy(component, entityID)
  {
    component.position = undefined;
    component.scale = undefined;
    component.pitch = undefined;
    component.yaw = undefined;
    component.roll = undefined;
    component._eulerRotation = undefined;
    component.toMatrix = undefined;
  }
}

const INSTANCE = new Transform();
export default INSTANCE;
