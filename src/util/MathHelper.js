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
