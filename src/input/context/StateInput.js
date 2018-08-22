import ContextualInput from './ContextualInput.js';

class StateInput extends ContextualInput
{
  constructor(name)
  {
    super(name);

    this._otherID = null;
  }

  onContextRegister(context, inputID)
  {
    if (this._inputID == null)
    {
      super.onContextRegister(context, inputID);
    }
    else if (this._otherID == null)
    {
      if (this._context != context)
      {
        throw new Error("Cannot register state input calls to another context");
      }
      this._otherID = inputID;
    }
  }

  onContextUnregister(context, inputID)
  {
    if (inputID == this._inputID)
    {
      this._inputID = null;
    }
    else if (inputID == this._otherID)
    {
      this._otherID = null;
    }

    if (this._inputID == null && this._otherID == null)
    {
      super.onContextUnregister(context, inputID);
    }
  }

  processInput(event)
  {
    if (this._otherID == null)
    {
      throw new Error("Missing another registered input call for state input");
    }

    if (event.id == this._inputID)
    {
      return true;
    }
    else if (event.id == this._otherID)
    {
      return false;
    }
    else
    {
      return null;
    }
  }
}

export default StateInput;
