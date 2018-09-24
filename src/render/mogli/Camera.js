import { mat4, vec3, quat, vec4 } from 'gl-matrix';

class Camera
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.zNear = 0.1;
    this.zFar = 1000.0;

    this._projectionMatrix = mat4.create();
    this._viewMatrix = mat4.create();

    this._invertedProjectionMatrix = mat4.create();
    this._invertedViewMatrix = mat4.create();
    this._unprojectVector = vec4.create();

    this.transformationMatrix = mat4.create();
    this.rotationMatrix = mat4.create();
    this.scaleMatrix = mat4.create();
    this.inverseRotation = quat.create();

    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
  }

  getWidth()
  {
    return this.canvas.clientWidth;
  }

  getHeight()
  {
    return this.canvas.clientHeight;
  }

  getAspectRatio()
  {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  getProjectionMatrix()
  {
    mat4.identity(this._projectionMatrix);
    return this._projectionMatrix;
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

  unproject(screenX, screenY, dst=vec3.create())
  {
    const width = this.getWidth();
    const height = this.getHeight();
    const x = screenX;
    const y = screenY;
    const vec = vec4.create();

    //Get inverted matrices
    mat4.invert(this._invertedProjectionMatrix, this.getProjectionMatrix());
    mat4.invert(this._invertedViewMatrix, this.getViewMatrix());

    //To Normalized Device Coords
    vec[0] = (2.0 * x) / width - 1.0;
    //Since screen y-axis is from top to bottom,
    //and opengl is from bottom to top, invert it.
    vec[1] = 1.0 - (2.0 * y) / height;

    //To Homogenous Clip Coords
    //vec[0] = vec[0];
    //vec[1] = vec[1];
    vec[2] = -1.0;
    vec[3] = 1.0;

    //To Camera Coords
    vec4.transformMat4(vec, vec, this._invertedProjectionMatrix);
    //Forward vector (not a point)
    vec[2] = -1.0;
    vec[3] = 0.0;

    //To World Coords
    vec4.transformMat4(vec, vec, this._invertedViewMatrix);
    dst[0] = vec[0];
    dst[1] = vec[1];
    dst[2] = vec[2];
    vec3.normalize(dst, dst);
    //vec3.sub(dst, dst, this.position);

    return dst;
  }
}

export default Camera;
