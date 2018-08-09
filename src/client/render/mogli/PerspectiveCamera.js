import { mat4, vec3, quat } from 'gl-matrix';

class PerspectiveCamera
{
  constructor(gl)
  {
    this._gl = gl;

    this.fieldOfView = 45 * Math.PI / 180;
    this.zNear = 0.1;
    this.zFar = 100.0;

    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
  }

  getAspectRatio()
  {
    const gl = this._gl;
    return gl.canvas.clientWidth / gl.canvas.clientHeight;
  }

  getProjectionMatrix()
  {
    return mat4.perspective(this.projectionMatrix,
      this.fieldOfView,
      this.getAspectRatio(),
      this.zNear, this.zFar);
  }

  getViewMatrix()
  {
    return mat4.fromRotationTranslationScale(this.viewMatrix,
      this.rotation,
      this.position,
      this.scale);
  }
}

export default PerspectiveCamera;
