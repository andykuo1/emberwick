import { mat4, vec3, quat, vec4 } from 'gl-matrix';

class PerspectiveCamera
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
