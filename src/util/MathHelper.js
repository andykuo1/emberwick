import { vec2, vec3 } from 'gl-matrix';

export const EPSILON = 1e-8;
export const XAXIS = vec3.create(1, 0, 0);
export const YAXIS = vec3.create(0, 1, 0);
export const ZAXIS = vec3.create(0, 0, 1);

export function distSqu(x1, y1, x2, y2)
{
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
};

export function reflect2(vec, normal, dst=vec2.create())
{
  const dot = vec[0] * normal[0] + vec[1] * normal[1];
  const ux = normal[0] * dot;
  const uy = normal[1] * dot;
  const wx = vec[0] - ux;
  const wy = vec[1] - uy;
  dst[0] = wx - ux;
  dst[1] = wy - uy;
  return dst;
}

export function abs(value)
{
  return value < 0 ? -value : value;
};

export function clamp(value, min, max)
{
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
};

export function sign(value)
{
  return value < 0 ? -1 : 1;
};

export function hash3D(x, y, z)
{
  return (((53 + hashInt(x)) * 53 + hashInt(y)) * 53 + hashInt(z));
};

export function hash2D(x, y)
{
  return ((53 + hashInt(x)) * 53 + hashInt(y));
};

//Robert Jenkin's 32 bit integer hash function
export function hashInt(a)
{
  a = (a+0x7ed55d16) + (a<<12);
  a = (a^0xc761c23c) ^ (a>>19);
  a = (a+0x165667b1) + (a<<5);
  a = (a+0xd3a2646c) ^ (a<<9);
  a = (a+0xfd7046c5) + (a<<3);
  a = (a^0xb55a4f09) ^ (a>>16);
  return a;
};
