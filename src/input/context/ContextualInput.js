class ContextualInput
{
  constructor(name)
  {
    this.name = name;
    this._context = null;
    this._inputID = null;
  }

  onContextRegister(context, inputID)
  {
    if (this._context != null)
    {
      throw new Error("Cannot register input already registered with another context");
    }

    this._context = context;
    this._inputID = inputID;
  }

  onContextUnregister(context, inputID)
  {
    this._context = null;
    this._inputID = null;
  }

  processInput(event)
  {
    return event;
  }
}

export default ContextualInput;
