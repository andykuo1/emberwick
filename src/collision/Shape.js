import { vec2 } from 'gl-matrix';

export class ShapeAABB
{
  constructor(x, y, halfWidth, halfHeight)
  {
    this.position = vec2.fromValues(x, y);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
  }
}

export class ShapePoint
{
  constructor(x, y)
  {
    this.position = vec2.fromValues(x, y);
  }
}

export class ShapeSegment
{
  constructor(x, y, dx, dy);
  {
    this.position = vec2.fromValues(x, y);
    this.dx = dx;
    this.dy = dy;
  }
}

export class ShapeCircle
{
  constructor(x, y, radius)
  {
    this.position = vec2.fromValues(x, y);
    this.radius = radius;
  }
}
