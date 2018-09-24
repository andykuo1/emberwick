import Entity from 'entity/Entity.js';

import { vec3, mat4, quat } from 'gl-matrix';
import Drawable from './Drawable.js';

class EntityParticle extends Entity
{
  constructor(world, x=0, y=0)
  {
    super();

    this.world = world;
    this.x = x;
    this.y = y;
    this.rotation = quat.create();

    this.maxAge = 5 + 20 * Math.random();
    this.age = this.maxAge;
    this.size = 1;

    this.hspeed = ((Math.random() * 2) - 1) * 0.5;
    this.vspeed = 1 + Math.random() * 2;
    this.maxVSpeed = 10;
    this.gravity = 0.6;
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.addComponent(Drawable);
    drawable.material = "color.tex";
  }

  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.age -= dt;
    if (this.age < 0)
    {
      this.setDead();
    }
    this.size = this.age / this.maxAge;

    this.x += this.hspeed * dt;
    this.y += this.vspeed * dt;

    if (this.vspeed > this.maxVSpeed) this.vspeed = this.maxVSpeed;
    else this.vspeed -= this.gravity * dt;

    const drawable = this.getComponent(Drawable);
    mat4.fromRotationTranslationScale(drawable.transform, this.rotation, vec3.fromValues(this.x, this.y, 1), vec3.fromValues(this.size, this.size, 1));
  }
}

export default EntityParticle;
