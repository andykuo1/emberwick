import Entity from 'entity/Entity.js';
import { reflect2 } from 'util/MathHelper.js';

import { quat, mat4, vec3, vec2 } from 'gl-matrix';

import EntityParticle from './EntityParticle.js';

import Drawable from './Drawable.js';

class EntityBall extends Entity
{
  constructor(world)
  {
    super();
    this.world = world;

    this.x = 0;
    this.y = 0;
    this.rotation = quat.create();
    this.radius = 8;
    this.bufferRadius = 0.5;

    this.motion = vec2.create();
    this.motion[0] = (Math.random() * 2) - 1;
    this.motion[1] = (Math.random() * 2) - 1;
    this.moveSpeed = 0.5;
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.addComponent(Drawable);
    drawable.mesh = "quad.mesh";
    drawable.material = "rock.tex";
  }

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.x += this.motion[0] * this.moveSpeed * dt;
    this.y += this.motion[1] * this.moveSpeed * dt;

    if (this.x < -10)
    {
      reflect2(this.motion, vec2.fromValues(-1, 0), this.motion);
      this.x = -10;
    }
    else if (this.x > 10)
    {
      reflect2(this.motion, vec2.fromValues(1, 0), this.motion);
      this.x = 10;
    }

    if (this.y < -10)
    {
      reflect2(this.motion, vec2.fromValues(0, -1), this.motion);
      this.y = -10;
    }
    else if (this.y > 10)
    {
      reflect2(this.motion, vec2.fromValues(0, 1), this.motion);
      this.y = 10;
    }

    const drawable = this.getComponent(Drawable);
    mat4.fromRotationTranslationScale(drawable.transform, this.rotation, vec3.fromValues(this.x, this.y, 0), vec3.fromValues(this.radius * 2, this.radius * 2, 1));
  }

  onHit()
  {
    this.radius *= 0.8;
    this.moveSpeed *= 1.1;

    this.motion[0] = (Math.random() * 2) - 1;
    this.motion[1] = (Math.random() * 2) - 1;
    vec2.normalize(this.motion, this.motion);

    let dx = 0;
    let dy = 0;
    for(let i = 0; i < this.radius * 10 || i <= 0; ++i)
    {
      dx = (Math.random() - 0.5) * this.radius;
      dy = (Math.random() - 0.5) * this.radius;
      this.entityManager.addCustomEntity(new EntityParticle(this.world, this.x + dx, this.y + dy));
    }
  }
}

export default EntityBall;
