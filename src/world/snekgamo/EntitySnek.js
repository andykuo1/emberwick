import { vec3 } from 'gl-matrix';

import { ZAXIS } from 'util/MathHelper.js';

import EntityLiving from './EntityLiving.js';
import EntitySnekBody from './EntitySnekBody.js';

import Drawable from './Drawable.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

class EntitySnek extends EntityLiving
{
  constructor(world)
  {
    super(world);
    
    this.wiggleCounter = 0;
    this.wiggleAngle = 0;

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.getComponent(Drawable);
    drawable.mesh = "quad.mesh";
    drawable.material = "color.tex";
    drawable.drawMode = "wireframe";

    this.world.getInputManager().addCallback(this.onInputUpdate);

    let body = this;
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
    body = this.world.getEntityManager().addCustomEntity(new EntitySnekBody(this.world, body));
  }

  onInputUpdate(input)
  {
    const motion = this.getComponent(Motion);
    const dx = (input.getState("strafeLeft") ? -1 : 0) + (input.getState("strafeRight") ? 1 : 0);
    const dy = (input.getState("moveForward") ? 1 : 0) + (input.getState("moveBackward") ? -1 : 0);
    motion.moveVector[0] = dx;
    motion.moveVector[1] = dy;
    motion.moveVector[2] = 0;

    if (dx || dy)
    {
      motion.moveVector[0] += dy * this.wiggleAngle * 0.8;
      motion.moveVector[1] += -dx * this.wiggleAngle * 0.8;
    }
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.wiggleCounter += dt;
    this.wiggleAngle = Math.cos(this.wiggleCounter / 1.5);
  }

  //Override
  onDestroy()
  {
    super.onDestroy();

    this.world.getInputManager().removeCallback(this.onInputUpdate);
  }
}

export default EntitySnek;
