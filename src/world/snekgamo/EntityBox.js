import EntityLiving from './EntityLiving.js';

import Drawable from './Drawable.js';

class EntityBox extends EntityLiving
{
  constructor(world)
  {
    super(world);
  }

  //Override
  onCreate()
  {
    super.onCreate();

    const drawable = this.getComponent(Drawable);
    drawable.mesh = "cube.mesh";
  }
}

export default EntityBox;
