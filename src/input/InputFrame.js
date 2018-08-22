class InputFrame
{
  constructor()
  {
    this.actions = [];
    this.states = [];
    this.ranges = new Map();
  }

  setAction(inputName)
  {
    this.actions.push(inputName);
  }

  hasAction(inputName)
  {
    return this.actions.includes(inputName);
  }

  getAction(inputName, consume=true)
  {
    if (this.actions.includes(inputName))
    {
      if (consume)
      {
        this.actions.splice(this.actions.indexOf(inputName), 1);
      }
      return true;
    }
    else
    {
      return false;
    }
  }

  setState(inputName)
  {
    this.states.push(inputName);
  }

  hasState(inputName)
  {
    return this.states.includes(inputName);
  }

  getState(inputName, consume=true)
  {
    if (this.states.includes(inputName))
    {
      if (consume)
      {
        this.states.splice(this.states.indexOf(inputName), 1);
      }

      return true;
    }
    else
    {
      return false;
    }
  }

  setRange(inputName, value)
  {
    this.ranges.set(inputName, value);
  }

  hasRange(inputName)
  {
    return this.ranges.has(inputName);
  }

  getRange(inputName, consume=true)
  {
    if (this.ranges.has(inputName))
    {
      const result = this.ranges.get(inputName);
      if (consume)
      {
        this.ranges.delete(inputName);
      }
      return result;
    }
    else
    {
      return null;
    }
  }

  clear()
  {
    this.actions.length = 0;
    this.states.length = 0;
    this.ranges.clear();
  }
}

export default InputFrame;
