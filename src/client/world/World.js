import { mat4 } from 'gl-matrix';

import EntityManager from 'ecs/EntityManager.js';
import Renderable from 'world/component/Renderable.js';

import CubeEntity from 'world/entity/CubeEntity.js';

class World
{
  constructor(renderer, app)
  {
    this.renderer = renderer;
    this.app = app;

    this.entityManager = new EntityManager();
    this.entityManager.registerComponentClass(Renderable);
  }

  create()
  {
    const entityManager = this.entityManager;
    entityManager.createEntity(CubeEntity, this.renderer.sceneGraph);
  }

  destroy()
  {
    this.entityManager.clear();
  }

  update(dt)
  {
    for(const renderable of this.entityManager.getComponentsByClass(Renderable))
    {
      const transform = renderable.getTransform();
      mat4.rotateY(transform, transform, 0.01);
      mat4.rotateZ(transform, transform, 0.01);
      renderable._sceneNode.update(dt);
    }
  }
}

export default World;
