import { vec2 } from 'gl-matrix';

class ShapeAABB
{
  constructor(x, y, halfWidth, halfHeight)
  {
    this.position = vec2.fromValues(x, y);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
  }
}

export default ShapeAABB;
