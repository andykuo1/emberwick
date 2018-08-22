import ContextualInput from './ContextualInput.js';

class RangeInput extends ContextualInput
{
  constructor(name, min, max, context=null)
  {
    super(name, context);

    if (typeof max != 'number' || typeof min != 'number')
    {
      throw new Error("Range bounds for input not specified");
    }

    if (max < min)
    {
      throw new Error("Max range must be greater than min range");
    }

    this.min = min;
    this.max = max;

    const normal = max - min;
    if (normal == 0)
    {
      throw new Error("Range of input cannot be zero");
    }
    this._normal = normal;
  }

  processInput(event)
  {
    return this.normalize(event.amount);
  }

  normalize(value)
  {
    return (value - this.min) / this._normal;
  }
}

export default RangeInput;
