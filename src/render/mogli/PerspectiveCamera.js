import { mat4, vec3, quat } from 'gl-matrix';

class PerspectiveCamera
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.fieldOfView = 45 * Math.PI / 180;
    this.zNear = 0.1;
    this.zFar = 100.0;

    this._projectionMatrix = mat4.create();
    this._viewMatrix = mat4.create();

    this.transformationMatrix = mat4.create();
    this.rotationMatrix = mat4.create();
    this.scaleMatrix = mat4.create();
    this.inverseRotation = quat.create();

    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
  }

  getAspectRatio()
  {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  getProjectionMatrix()
  {
    return mat4.perspective(this._projectionMatrix,
      this.fieldOfView,
      this.getAspectRatio(),
      this.zNear, this.zFar);
  }

  getViewMatrix()
  {
    mat4.fromTranslation(this.transformationMatrix, this.position);
    mat4.fromQuat(this.rotationMatrix, quat.invert(this.inverseRotation, this.rotation));
    mat4.fromScaling(this.scaleMatrix, this.scale);
    mat4.mul(this._viewMatrix, this.transformationMatrix, this.scaleMatrix);
    mat4.mul(this._viewMatrix, this.rotationMatrix, this._viewMatrix);
    return this._viewMatrix;
  }
}

export default PerspectiveCamera;
