import Component from 'entity/Component.js';

import { vec2, mat4 } from 'gl-matrix';

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
    component.textureOffset = vec2.create();
    component.textureScale = vec2.fromValues(1, 1);
  }

  //Override
  onComponentDestroy(component, entityID)
  {
    component.transform = undefined;
    component.visible = undefined;
    component.mesh = undefined;
    component.material = undefined;
    component.drawMode = undefined;
    component.textureOffset = undefined;
    component.textureScale = undefined;
  }
}

const INSTANCE = new Drawable();
export default INSTANCE;
