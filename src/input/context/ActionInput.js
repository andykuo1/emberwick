import ContextualInput from './ContextualInput.js';

class ActionInput extends ContextualInput
{
  constructor(name, context=null)
  {
    super(name, context);
  }

  processInput(event)
  {
    return true;
  }
}

export default ActionInput;
