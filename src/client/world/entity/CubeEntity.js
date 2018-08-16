import Entity from './Entity.js';

import Renderable from 'world/component/Renderable.js';
import SceneNode from 'scenegraph/SceneNode.js';

class CubeEntity
{
  onCreate(entityManager, entityID, world, parentNode)
  {
    if (!world || !parentNode) throw new Error("Missing arguments for entity \'" + this.getClassID() + "\'");

    const renderable = entityManager.addComponentToEntity(entityID, Renderable);
    {
      const node = new SceneNode("capsule.mesh");
      node.setParent(parentNode);
      renderable._sceneNode = node;
    }
  }

  onDestroy(entityManager, entityID)
  {
    const renderable = entityManager.getComponentFromEntity(entityID, Renderable);
    {
      renderable._sceneNode.delete();
    }
  }

  getClassID()
  {
    return Entity.getClassID() + ".cube";
  }
}

export default new CubeEntity();
