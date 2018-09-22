import { vec3 } from 'gl-matrix';

import Collider from './Collider.js';
import Transform from './Transform.js';
import Motion from './Motion.js';

import { reflect2 } from 'util/MathHelper.js';

class CollisionSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
    this.solids = [];
    this.collisions = new Map();
  }

  onUpdate(dt)
  {
    this.solids.length = 0;
    let entities = this.entityManager.getEntitiesByComponent(Collider);
    for(const entity of entities)
    {
      const collider = this.entityManager.getComponentFromEntity(Collider, entity);
      const transform = this.entityManager.getComponentFromEntity(Transform, entity);
      const shape = collider.shape;
      if (transform)
      {
        shape.position[0] = transform.position[0];
        shape.position[1] = transform.position[1];
      }
      if (collider.solid)
      {
        this.solids.push(shape);
      }
    }

    const velocity = vec2.create();
    this.collisions.clear();
    entities = this.entityManager.getEntitiesByComponent(Collider);
    for(const entity of entities)
    {
      const collider = this.entityManager.getComponentFromEntity(Collider, entity);
      const motion = this.entityManager.getComponentFromEntity(Motion, entity);
      if (motion)
      {
        vec2.fromValues(velocity, motion.moveVector[0], motion.moveVector[1]);
        vec2.scale(velocity, velocity, motion.moveSpeed);

        const result = checkCollision(collider.shape, this.solids, velocity);
        if (result.intersection)
        {
          if (collider.solid)
          {
            const transform = this.entityManager.getComponentFromEntity(Transform, entity);
            transform.position[0] = result.furthest[0];
            transform.position[1] = result.furthest[1];
          }

          if (collider.reflect)
          {
            reflect2(motion.moveVector, result.intersection.normal, motion.moveVector);
            vec2.normalize(motion.moveVector, motion.moveVector);
          }
          else
          {
            //HACK: to get out of the wall
            motion.moveSpeed = -0.1;
          }

          this.collisions.set(collider.shape, result);
        }
      }
    }
  }

  getCollisions()
  {
    return this.collisions;
  }
}

export default CollisionSystem;

import { vec2 } from 'gl-matrix';
import * as MathHelper from 'util/MathHelper.js';

class IntersectionData
{
  constructor()
  {
    this.collider = null;
    this.point = vec2.create();
    this.delta = vec2.create();
    this.normal = vec2.create();
    this.intersectionTime = 0;
  }
}

class CollisionData
{
  constructor()
  {
    this.intersection = null;
    this.furthest = vec2.create();
    this.collisionTime = 1;
  }
}

function intersectSegment(collider, position, delta, paddingX, paddingY, dst=null)
{
  const scaleX = 1.0 / delta[0];
  const scaleY = 1.0 / delta[1];
  const signX = MathHelper.sign(scaleX);
  const signY = MathHelper.sign(scaleY);
  const nearTimeX = (collider.position[0] - signX * (collider.halfWidth + paddingX) - position[0]) * scaleX;
  const nearTimeY = (collider.position[1] - signY * (collider.halfHeight + paddingY) - position[1]) * scaleY;
  const farTimeX = (collider.position[0] + signX * (collider.halfWidth + paddingX) - position[0]) * scaleX;
  const farTimeY = (collider.position[1] + signY * (collider.halfHeight + paddingY) - position[1]) * scaleY;

  if (nearTimeX > farTimeX || nearTimeY > farTimeY) return null;

  const nearTime = nearTimeX > nearTimeY ? nearTimeX : nearTimeY;
  const farTime = farTimeX < farTimeY ? farTimeX : farTimeY;

  if (nearTime >= 1 || farTime <= 0) return null;

  const intersection = dst || new IntersectionData();
  intersection.collider = collider;

  const time = MathHelper.clamp(nearTime, 0, 1);
  if (nearTimeX > nearTimeY)
  {
    intersection.normal[0] = -signX;
    intersection.normal[1] = 0;
  }
  else
  {
    intersection.normal[0] = 0;
    intersection.normal[1] = -signY;
  }

  intersection.delta[0] = time * delta[0];
  intersection.delta[1] = time * delta[1];
  intersection.point[0] = position[0] + intersection.delta[0];
  intersection.point[1] = position[1] + intersection.delta[1];
  intersection.intersectionTime = time;
  return intersection;
}

function intersectAABB(collider, box, dst=null)
{
  const dx = box.position[0] - collider.position[0];
  const px = (box.halfWidth + collider.halfWidth) - MathHelper.abs(dx);
  if (px <= 0) return null;

  const dy = box.position[1] - collider.position[1];
  const py = (box.halfHeight + collider.halfHeight) - MathHelper.abs(dy);
  if (py <= 0) return null;

  const intersection = dst || new IntersectionData();
  intersection.collider = collider;

  if (px < py)
  {
    const sx = MathHelper.sign(dx);
    intersection.delta[0] = px * sx;
    intersection.normal[0] = sx;
    intersection.point[0] = collider.position[0] + (collider.halfWidth * sx);
    intersection.point[1] = box.position[1];
  }
  else
  {
    const sy = MathHelper.sign(dy);
    intersection.delta[1] = py * sy;
    intersection.normal[1] = sy;
    intersection.point[0] = box.position[0];
    intersection.point[1] = collider.position[1] + (collider.halfHeight * sy);
  }

  return intersection;
}

function collideAABB(collider, box, delta, dst=null)
{
  const collision = dst || new CollisionData();
  collision.intersection = null;
  if (collider === box) return collision;

  if (delta[0] === 0 && delta[1] === 0)
  {
    collision.furthest[0] = box.position[0];
    collision.furthest[1] = box.position[1];
    const intersection = intersectAABB(collider, box);
    if (intersection)
    {
      intersection.intersectionTime = 0;
      collision.collisionTime = 0;
    }
    else
    {
      collision.collisionTime = 1;
    }
    collision.intersection = intersection;
    return collision;
  }
  else
  {
    const intersection = intersectSegment(collider, box.position, delta, box.halfWidth, box.halfHeight);
    if (intersection)
    {
      const time = MathHelper.clamp(intersection.intersectionTime - MathHelper.EPSILON, 0, 1);
      collision.furthest[0] = box.position[0] + delta[0] * time;
      collision.furthest[1] = box.position[1] + delta[1] * time;
      collision.collisionTime = time;

      const direction = vec2.normalize(vec2.create(), delta);
      intersection.point[0] = MathHelper.clamp(
        intersection.point[0] + direction[0] * box.halfWidth,
        collider.position[0] - collider.halfWidth,
        collider.position[0] + collider.halfWidth
      );
      intersection.point[1] = MathHelper.clamp(
        intersection.point[1] + direction[1] * box.halfHeight,
        collider.position[1] - collider.halfHeight,
        collider.position[1] + collider.halfHeight
      );
    }
    else
    {
      collision.furthest[0] = box.position[0] + delta[0];
      collision.furthest[1] = box.position[1] + delta[1];
      collision.collisionTime = 1;
    }
    collision.intersection = intersection;
    return collision;
  }
}

function checkCollision(collider, others, delta, dst=null)
{
  let other = new CollisionData();
  let nearest = dst || new CollisionData();
  nearest.collisionTime = 1;
  nearest.furthest[0] = collider.position[0] + delta[0];
  nearest.furthest[1] = collider.position[1] + delta[1];
  for(let i = 0, length = others.length; i < length; ++i)
  {
    collideAABB(others[i], collider, delta, other);
    if (other.collisionTime < nearest.collisionTime)
    {
      let prev = nearest;
      nearest = other;
      other = prev;
    }
  }
  return nearest;
}
