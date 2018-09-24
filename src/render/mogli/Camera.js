import { mat4, vec3, quat, vec4 } from 'gl-matrix';

class Camera
{
  constructor(viewport)
  {
    this.viewport = viewport;

    this.zNear = 0.1;
    this.zFar = 1000.0;

    this._projectionMatrix = mat4.create();
    this._viewMatrix = mat4.create();

    this._invertedProjectionMatrix = mat4.create();
    this._invertedViewMatrix = mat4.create();

    this.transformationMatrix = mat4.create();
    this.rotationMatrix = mat4.create();
    this.scaleMatrix = mat4.create();
    this.inverseRotation = quat.create();

    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
  }

  getViewPort()
  {
    return this.viewport;
  }

  getProjectionMatrix()
  {
    mat4.identity(this._projectionMatrix);
    return this._projectionMatrix;
  }

  getInvertedProjectionMatrix()
  {
    mat4.invert(this._invertedProjectionMatrix, this.getProjectionMatrix());
    return this._invertedProjectionMatrix;
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

  getInvertedViewMatrix()
  {
    mat4.invert(this._invertedViewMatrix, this.getViewMatrix());
    return this._invertedViewMatrix;
  }

  screenToWorld(screenX, screenY, dst)
  {
    throw new Error("Camera type does not support screen-space raycasting");
  }
}

export default Camera;
