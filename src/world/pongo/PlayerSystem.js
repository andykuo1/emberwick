import Motion from './Motion.js';

class PlayerSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
    this.playerID = -1;
  }

  setPlayer(playerID)
  {
    this.playerID = playerID;
  }

  onInputUpdate(input)
  {
    if (this.playerID < 0) return;

    const motion = this.entityManager.getComponentFromEntity(Motion, this.playerID);
    if (motion)
    {
      const dy = (input.getState("moveForward") ? 1 : 0) + (input.getState("moveBackward") ? -1 : 0);
      motion.moveVector[1] = dy;
    }
  }
}

export default PlayerSystem;
