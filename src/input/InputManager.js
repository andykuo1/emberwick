import Mouse from './Mouse.js';
import Keyboard from './Keyboard.js';
import InputFrame from './InputFrame.js';
import * as InputCodes from './InputCodes.js';

import ActionInput from './context/ActionInput.js';
import StateInput from './context/StateInput.js';
import RangeInput from './context/RangeInput.js';

class InputManager
{
  constructor(canvas)
  {
    this._inputEvent = {
      id: null,
      down: false,
      amount: 0,
    };

    this._contexts = [];
    this._callbacks = [];
    this._priorityComparator = (a, b) => a[1] - b[1];
    this._inputFrame = new InputFrame();

    this._mouse = null;
    this._mousedown = null;
    this._mouseup = null;
    this._mousemove = null;

    this._keyboard = null;
    this._keyup = null;
    this._keydown = null;

    this._gamepad = null;
  }

  setKeyboard(keyboard)
  {
    if (this._keyboard != null)
    {
      this._keyboard.removeEventListener("down", this._keydown);
      this._keyboard.removeEventListener("up", this._keyup);
      this._keyboard = null;
    }

    this._keydown = (e) => {
      if (e.repeat) return;
      this.onInput("key", "down", e.which);
    };
    this._keyup = (e) => {
      this.onInput("key", "up", e.which);
    };

    keyboard.on("down", this._keydown);
    keyboard.on("up", this._keyup);
    this._keyboard = keyboard;
  }

  setMouse(mouse)
  {
    if (this._mouse != null)
    {
      this._mouse.removeEventListener("down", this._mousedown);
      this._mouse.removeEventListener("up", this._mouseup);
      this._mouse.removeEventListener("move", this._mousemove);
      this._mouse = null;
    }

    this._mousedown = (e) => {
      if (e.repeat) return;
      this.onInput("mouse", "down", e.which);
    };
    this._mouseup = (e) => {
      this.onInput("mouse", "up", e.which);
    };
    this._mousemove = (e) => {
      this.onInput("mouse", "move", InputCodes.MOUSE_X, e.movementX);
      this.onInput("mouse", "move", InputCodes.MOUSE_Y, e.movementY);
    };

    mouse.on("down", this._mousedown);
    mouse.on("up", this._mouseup);
    mouse.on("move", this._mousemove);
    this._mouse = mouse;
  }

  setGamePad(gamePad)
  {
    throw new Error("Sorry, not yet supported.");
  }

  addContext(context, priority=0)
  {
    this._contexts.push([context, priority]);
    this._contexts.sort(this._priorityComparator);
    return context;
  }

  removeContext(context)
  {
    let i = this._contexts.length;
    while(i--)
    {
      if (this._contexts[i][0] == context)
      {
        this._contexts.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  addCallback(callback, priority=0)
  {
    this._callbacks.push([callback, priority]);
    this._callbacks.sort(this._priorityComparator);
    return callback;
  }

  removeCallback(callback)
  {
    let i = this._callbacks.length;
    while(i--)
    {
      if (this._callbacks[i][0] == callback)
      {
        this._callbacks.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  doInputUpdate()
  {
    const inputFrame = this._inputFrame;

    let context;
    for(const pair of this._contexts)
    {
      context = pair[0];
      context.onInputUpdate(inputFrame);
    }

    let callback;
    for(const pair of this._callbacks)
    {
      callback = pair[0];
      callback(inputFrame);
    }
  }

  onInput(src, eventType, keycode, eventValue=true)
  {
    const dst = this._inputFrame;
    const event = this._inputEvent;
    if (typeof eventValue == 'number')
    {
      event.down = eventValue > 0;
      event.amount = eventValue;
    }
    else
    {
      event.down = eventValue;
      event.amount = eventValue ? 1 : 0;
    }
    event.id = src + "." + eventType + "." + keycode;

    let flag = false;
    let context, inputList, value;
    for(const pair of this._contexts)
    {
      context = pair[0];
      inputList = context.getMappedInputs(src, eventType, keycode);
      if (inputList && inputList.length > 0)
      {
        for(const input of inputList)
        {
          value = input.processInput(event);
          if (value != null)
          {
            //Add it to the appropriate list
            if (input instanceof ActionInput)
            {
              dst.setAction(input.name);
            }
            else if (input instanceof StateInput)
            {
              //State inputs are added to input frame on input update
              //dst.setState(input.name);
              context.setActiveState(input.name, value);
            }
            else if (input instanceof RangeInput)
            {
              dst.setRange(input.name, value);
            }
            else
            {
              throw new Error("Unknown input type \'" + result + "\'");
            }

            flag = true;
          }
        }

        if (flag) return true;
      }
    }

    return false;
  }
}

export default InputManager;
