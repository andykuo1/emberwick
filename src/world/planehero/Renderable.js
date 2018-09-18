import Component from 'entity/Component.js';
import SceneNode from 'scenegraph/SceneNode.js';

class Renderable extends Component
{
  //Override
  onComponentCreate(component, entityID)
  {
    component._sceneNode = new SceneNode();
    component.getTransform = function()
    {
      return this._sceneNode.transform;
    }.bind(component);
  }

  //Override
  onComponentDestroy(component, entityID)
  {
    component._sceneNode.delete();
    component._sceneNode = undefined;
    component.getTransform = undefined;
  }
}
const INSTANCE = new Renderable();
export default INSTANCE;
