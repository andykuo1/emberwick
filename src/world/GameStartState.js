import GameState from 'gamestate/GameState.js';
import PlayableGameState from './PlayableGameState.js';

import * as App from 'app/App.js';

import Mouse from 'input/Mouse.js';
import Keyboard from 'input/Keyboard.js';
import InputManager from 'input/InputManager.js';
import EntityManager from 'ecs/EntityManager.js';

import GameRenderer from 'world/GameRenderer.js';

class GameStartState extends GameState
{
  constructor()
  {
    super("GameStart");

    this.canvas = null;
    this.gl = null;
    this.assets = null;

    this.renderer = null;

    this.entityManager = null;
    this.inputManager = null;

    this.mouse = null;
    this.keyboard = null;
  }

  //Override
  onLoad()
  {
    const parent = this.getPrevGameState();
    const canvas = this.canvas = parent.canvas;
    const gl = this.gl = parent.gl;
    const assets = this.assets = parent.assetManager;

    this.entityManager = new EntityManager();
    this.inputManager = new InputManager();

    this.mouse = new Mouse(canvas);
    this.keyboard = new Keyboard();
    this.inputManager.setMouse(this.mouse);
    this.inputManager.setKeyboard(this.keyboard);

    this.renderer = new GameRenderer(assets);

    return new Promise((resolve, reject) => {
      this.renderer.load(gl, () => resolve(this));
    });
  }

  //Override
  onStart() {}

  //Override
  onUpdateState(dt)
  {
    this.inputManager.doInputUpdate();

    this.entityManager.update(dt);

    const gameState = this.getNextGameState();
    if (gameState)
    {
      this.renderer.render(this.gl, gameState);
    }
  }

  //Override
  onUpdate(dt) {}

  //Override
  onSuspend() {}

  //Override
  onResume() {}

  //Override
  onStop() {}

  //Override
  onUnload()
  {
    this.entityManager.clear();

    this.renderer.unload(this.gl);
    this.keyboard.delete();
    this.mouse.delete();
  }

  //Override
  isValidNextGameState(gameState)
  {
    return super.isValidNextGameState(gameState) && gameState instanceof PlayableGameState;
  }
}

export default GameStartState;
