import { mat4, vec3, quat, vec4 } from 'gl-matrix';

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
    mat4.ortho(this._projectionMatrix,
      this.left, this.right,
      this.bottom, this.top
      this.zNear, this.zFar);
    return this._projectionMatrix;
  }
}

export default OrthographicCamera;
