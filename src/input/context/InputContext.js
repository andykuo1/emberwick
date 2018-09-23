import InputMapping from './InputMapping.js';

class InputContext
{
  constructor(mapping=null)
  {
    this._mapping = mapping || new InputMapping();
    this._activeStates = [];
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

  setInputMapping(inputMapping)
  {
    if (!inputMapping) throw new Error("Input mapping cannot be null");
    
    this._mapping = inputMapping;
    this._activeStates.length = 0;
  }

  getInputMapping()
  {
    return this._mapping;
  }
}

export default InputContext;
