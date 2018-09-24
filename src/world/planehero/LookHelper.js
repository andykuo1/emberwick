import { vec3, mat4, vec4 } from 'gl-matrix';

class LookHelper
{
  constructor()
  {
    this.camera = null;
    this.vector = vec3.create();
    this.raycast = null;

    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;

    this.invertedProjectionMatrix = mat4.create();
    this.invertedViewMatrix = mat4.create();
  }

  setX(x)
  {
    this.x = x;
  }

  setY(y)
  {
    this.y = y;
  }

  setCamera(camera)
  {
    this.camera = camera;
  }

  getVector()
  {
    return this.vector;
  }

  update()
  {
    if (!this.camera) return;

    this.raycast = this.camera.screenToWorld(this.x, this.y, this.raycast);
    vec3.copy(this.vector, this.raycast.position);
    vec3.add(this.vector, this.vector, this.raycast.direction);
  }
}

export default LookHelper;
