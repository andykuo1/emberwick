import { mat4 } from 'gl-matrix';
import Entity from 'entity/Entity.js';

import Renderable from 'world/planehero/Renderable.js';

class EntitySquare extends Entity
{
  constructor(world)
  {
    super();

    this.world = world;
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const renderable = this.addComponent(Renderable);
    renderable._sceneNode.setParent(this.world.sceneGraph);
    renderable._sceneNode.mesh = "quad.mesh";
    renderable._sceneNode.material = "rock.tex";
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    const renderable = this.getComponent(Renderable);
    const transform = renderable.getTransform();
    mat4.rotateX(transform, transform, 0.1);
  }
}

export default EntitySquare;
