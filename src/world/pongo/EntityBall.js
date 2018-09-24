import Entity from 'entity/Entity.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';
import Collider from './Collider.js';

class EntityBall extends Entity
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

    const drawable = this.addComponent(Drawable)
    drawable.mesh = "ball.mesh";
    this.addComponent(Transform);
    const motion = this.addComponent(Motion);
    motion.moveVector[0] = 1;
    motion.moveVector[1] = 1;
    motion.moveSpeed = 1;
    const collider = this.addComponent(Collider);
    collider.reflect = true;
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);
    const motion = this.getComponent(Motion);
    motion.moveSpeed = 1;
  }
}

export default EntityBall;
