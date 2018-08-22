import StateInput from './StateInput.js';

class InputContext
{
  constructor()
  {
    this._mapping = new Map();
    this._activeStates = [];
  }

  registerAction(src, eventType, keycode, actionInput)
  {
    this.registerInputByID(inputID(src, eventType, keycode), actionInput);
  }

  unregisterAction(actionInput)
  {
    return this.unregisterInputByID(actionInput._inputID, actionInput);
  }

  registerState(downSrc, downEventType, downKeyCode, upSrc, upEventType, upKeyCode, stateInput)
  {
    const id = inputID(downSrc, downEventType, downKeyCode);
    const otherid = inputID(upSrc, upEventType, upKeyCode);
    this.registerInputByID(id, stateInput);
    this.registerInputByID(otherid, stateInput);
  }

  unregisterState(stateInput)
  {
    this.unregisterInputByID(stateInput._otherID, stateInput);
    this.unregisterInputByID(stateInput._inputID, stateInput);
  }

  registerRange(src, eventType, keycode, rangeInput)
  {
    this.registerInputByID(inputID(src, eventType, keycode), rangeInput);
  }

  unregisterRange(rangeInput)
  {
    return this.unregisterInputByID(rangeInput._inputID, rangeInput);
  }

  registerInputByID(inputID, input)
  {
    if (!inputID)
    {
      throw new Error("Cannot register input to empty input id");
    }

    let inputList;
    if (!this._mapping.has(inputID))
    {
      this._mapping.set(inputID, inputList = []);
    }
    else
    {
      inputList = this._mapping.get(inputID);
    }
    inputList.push(input);

    input.onContextRegister(this, inputID);
    return input;
  }

  unregisterInputByID(inputID, input)
  {
    if (this._mapping.has(inputID))
    {
      const inputList = this._mapping.get(inputID);
      if (inputList.includes(input))
      {
        inputList.splice(inputList.indexOf(input), 1);

        input.onContextUnregister(this, inputID);
        return true;
      }
    }
    return false;
  }

  onInputUpdate(inputFrame)
  {
    for(const state of this._activeStates)
    {
      inputFrame.setState(state);
    }
  }

  setActiveState(stateInputName, value)
  {
    const activeStates = this._activeStates;
    if (value)
    {
      if (!activeStates.includes(stateInputName))
      {
        activeStates.push(stateInputName);
      }
    }
    else
    {
      if (activeStates.includes(stateInputName))
      {
        activeStates.splice(activeStates.indexOf(stateInputName), 1);
      }
    }
  }

  getMappedInputs(src, eventType, keycode)
  {
    return this._mapping.get(inputID(src, eventType, keycode));
  }
}

function inputID(src, eventType, keycode)
{
  if (!src)
  {
    throw new Error("Cannot get input id for non-existent input source");
  }

  if (!keycode)
  {
    throw new Error("Cannot get input id for non-existent key code");
  }

  if (!eventType)
  {
    throw new Error("Cannot get input id for non-existent event type");
  }

  return src + "." + eventType + "." + keycode;
}

export default InputContext;
