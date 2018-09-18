import { mat4 } from 'gl-matrix';
import Entity from 'entity/Entity.js';

import Renderable from 'world/planehero/Renderable.js';

class EntityTerrain extends Entity
{
  constructor(world)
  {
    super();

    this.world = world;
  }

  //Override
  onCreate(entityManager)
  {
    super.onCreate(entityManager);

    const renderable = this.addComponent(Renderable);
    renderable._sceneNode.setParent(this.world.sceneGraph);
    const transform = renderable.getTransform();
    mat4.rotateX(transform, transform, -Math.PI / 2);
    renderable._sceneNode.mesh = "plane.mesh";
    renderable._sceneNode.material = "rock.tex";
  }
}

export default EntityTerrain;
