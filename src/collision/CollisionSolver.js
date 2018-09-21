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

class AABB
{
  constructor(x, y, halfWidth, halfHeight)
  {
    this.position = vec2.fromValues(x, y);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
  }

  intersectPoint(position, dst=null)
  {
    const collider = this;

    const dx = position[0] - collider.position[0];
    const px = collider.halfWidth - MathHelper.abs(dx);
    if (px <= 0) return null;

    const dy = position[1] - collider.position[1];
    const py = collider.halfHeight - MathHelper.abs(dy);
    if (py <= 0) return null;

    const intersection = dst || new IntersectionData();
    intersection.collider = collider;

    if (px < py)
    {
      const sx = MathHelper.sign(dx);
      intersection.delta[0] = px * sx;
      intersection.normal[0] = sx;
      intersection.point[0] = collider.position[0] + (collider.halfWidth * sx);
      intersection.point[1] = position[1];
    }
    else
    {
      const sy = MathHelper.sign(dy);
      intersection.delta[1] = py * sy;
      intersection.normal[1] = sy;
      intersection.point[0] = position[0];
      intersection.point[1] = collider.position[1] + (collider.halfHeight * sy);
    }

    return intersection;
  }

  intersectSegment(position, delta, paddingX, paddingY, dst=null)
  {
    const collider = this;

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
    const farTim = farTimeX < farTimeY ? farTimeX : farTimeY;

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

  intersectAABB(box, dst=null)
  {
    const collider = this;

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

  collideAABB(box, delta, dst=null)
  {
    const collision = dst || new CollisionData();

    if (delta[0] === 0 && delta[1] === 0)
    {
      collision.furthest[0] = box.position[0];
      collision.furthest[1] = box.position[1];
      const intersection = this.intersectAABB(box);
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
      const intersection = this.intersectSegment(box.position, delta, box.halfWidth, box.halfHeight);
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

  checkCollision(others, delta)
  {
    let other = new CollisionData();
    let nearest = new CollisionData();
    nearest.collisionTime = 1;
    nearest.furthest[0] = this.position[0] + delta[0];
    nearest.furthest[1] = this.position[1] + delta[1];
    for(let i = 0, length = others.length; i < length; ++i)
    {
      others[i].collideAABB(this, delta, other);
      if (other.collisionTime < nearest.collisionTime)
      {
        let prev = nearest;
        nearest = other;
        other = prev;
      }
    }
    return nearest;
  }
}

export AABB;
