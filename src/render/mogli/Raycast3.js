import { vec3 } from 'gl-matrix';

class Raycast3
{
  constructor()
  {
    this.position = vec3.create();
    this.direction = vec3.create();
  }
}

export default Raycast3;
