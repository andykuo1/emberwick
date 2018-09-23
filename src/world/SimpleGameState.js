import GameState from 'app/GameState.js';

import EntityManager from 'entity/EntityManager.js';

import InputManager from 'input/InputManager.js';
import InputContext from 'input/context/InputContext.js';

class SimpleGameState extends GameState
{
  constructor()
  {
    super();

    this.entityManager = new EntityManager();

    this.inputContext = new InputContext();
    this.inputManager = null;

    this.onInputUpdate = this.onInputUpdate.bind(this);
  }

  //Override
  onLoad(opts)
  {
    if (!opts.canvas) throw new Error("Missing canvas from gamestate opts");
    if (!opts.renderEngine) throw new Error("Missing renderEngine from gamestate opts");

    this.inputManager = new InputManager(opts.canvas);

    const assetManager = opts.renderEngine.getAssetManager();
    assetManager.loadAsset("inputmap", "default.inputmap.json").then((inputMapping) => {
      this.inputContext.setInputMapping(inputMapping);
    });

    return super.onLoad(opts);
  }

  //Override
  onStart(opts)
  {
    this.inputManager.addContext(this.inputContext);
    this.inputManager.addCallback(this.onInputUpdate);
  }

  onInputUpdate(input) {}

  //Override
  onUpdate(dt)
  {
    super.onUpdate(dt);

    this.inputManager.doInputUpdate();
    this.entityManager.update(dt);
  }

  //Override
  onStop(opts)
  {
    super.onStop(opts);

    this.inputManager.removeCallback(this.onInputUpdate);
    this.inputManager.removeContext(this.inputContext);
  }

  //Override
  onUnload(opts)
  {
    super.onUnload(opts);

    this.entityManager.clear();
    this.inputManager.destroy();
  }

  getEntityManager()
  {
    return this.entityManager;
  }

  getInputManager()
  {
    return this.inputManager;
  }
}

export default SimpleGameState;
