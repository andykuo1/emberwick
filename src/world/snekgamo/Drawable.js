import Component from 'entity/Component.js';

import { mat4 } from 'gl-matrix';

class Drawable extends Component
{
  //Override
  onComponentCreate(component, entityID)
  {
    component.transform = mat4.create();
    component.visible = true;
    component.mesh = "quad.mesh";
    component.material = "rock.tex";
    component.drawMode = "model";
  }

  //Override
  onComponentDestroy(component, entityID)
  {
    component.transform = undefined;
    component.visible = undefined;
    component.mesh = undefined;
    component.material = undefined;
    component.drawMode = undefined;
  }
}

const INSTANCE = new Drawable();
export default INSTANCE;
