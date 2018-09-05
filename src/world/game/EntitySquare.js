import { mat4 } from 'gl-matrix';
import Entity from 'ecs/entity/Entity.js';
import Renderable from 'world/components/Renderable.js';

class EntitySquare extends Entity
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
    renderable._sceneNode.setParent(this.world.renderTarget.getSceneGraph());
    renderable._sceneNode.mesh = "quad.mesh";
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
