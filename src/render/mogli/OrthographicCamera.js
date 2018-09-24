import { mat4 } from 'gl-matrix';

import Camera from './Camera.js';

class OrthographicCamera extends Camera
{
  constructor(canvas)
  {
    super(canvas);

    this.left = -10;
    this.right = 10;
    this.bottom = -10;
    this.top = 10;
  }

  //Override
  getProjectionMatrix()
  {
    const aspectRatio = this.getAspectRatio();
    mat4.ortho(this._projectionMatrix,
      this.left * aspectRatio, this.right * aspectRatio,
      this.bottom, this.top,
      this.zNear, this.zFar);
    return this._projectionMatrix;
  }

  //Override
  unproject(screenX, screenY, dst)
  {
    throw new Error("Unsupported operation");
  }
}

export default OrthographicCamera;
