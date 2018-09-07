export const EPSILON = 1e-8;

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
