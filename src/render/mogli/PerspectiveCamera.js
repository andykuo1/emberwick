import { mat4 } from 'gl-matrix';

import Camera from './Camera.js';

class PerspectiveCamera extends Camera
{
  constructor(canvas)
  {
    super(canvas);

    this.fieldOfView = 45 * Math.PI / 180;
  }

  //Override
  getProjectionMatrix()
  {
    mat4.perspective(this._projectionMatrix,
      this.fieldOfView,
      this.getAspectRatio(),
      this.zNear, this.zFar);
    return this._projectionMatrix;
  }
}

export default PerspectiveCamera;
