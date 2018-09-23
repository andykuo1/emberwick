import AssetLoader from '../AssetLoader.js';

import InputMapping from 'input/context/InputMapping.js';
import ActionInput from 'input/context/ActionInput.js';
import StateInput from 'input/context/StateInput.js';
import RangeInput from 'input/context/RangeInput.js';
import * as InputCodes from 'input/InputCodes.js';

class InputMappingLoader extends AssetLoader
{
  constructor(assetManager, baseUrl)
  {
    super(assetManager, baseUrl, "text");
  }

  //Override
  onLoadResource(resource, opts, url)
  {
    return new Promise((resolve, reject) => {
      try
      {
        const result = parse(resource);
        resolve(result);
      }
      catch(e)
      {
        reject(e);
      }
    });
  }
}

export default InputMappingLoader;

function parse(string)
{
  const jsonData = JSON.parse(string);
  const result = new InputMapping();

  let data, type, args, opts, input;
  for(let prop in jsonData)
  {
    data = jsonData[prop];
    type = data.type;
    args = data.args;
    opts = data.opts || [];
    opts.unshift(prop);

    if (type === 'state')
    {
      input = new StateInput(...opts);
      result.registerState(
        args[0], args[1], InputCodes[args[2]],
        args[3], args[4], InputCodes[args[5]],
        input);
    }
    else if (type === 'action')
    {
      input = new ActionInput(...opts);
      result.registerRange(
        args[0], args[1], InputCodes[args[2]],
        input);
    }
    else if (type === 'range')
    {
      input = new RangeInput(...opts);
      result.registerRange(
        args[0], args[1], InputCodes[args[2]],
        input);
    }
    else
    {
      throw new Error("Unknown event type for input mapping \'" + type + "\'");
    }
  }

  return result;
}
