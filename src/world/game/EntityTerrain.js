import { mat4 } from 'gl-matrix';
import Entity from 'ecs/entity/Entity.js';
import Renderable from 'world/components/Renderable.js';

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
    renderable._sceneNode.setParent(this.world.renderTarget.getSceneGraph());
    const transform = renderable.getTransform();
    mat4.rotateX(transform, transform, -Math.PI / 2);
    renderable._sceneNode.mesh = "plane.mesh";
  }
}

export default EntityTerrain;
