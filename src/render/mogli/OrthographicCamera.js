import { vec3, vec4, mat4 } from 'gl-matrix';

import Camera from './Camera.js';
import Raycast3 from './Raycast3.js';

class OrthographicCamera extends Camera
{
  constructor(viewport)
  {
    super(viewport);

    this._unprojectVector = vec4.create();

    this.left = -10;
    this.right = 10;
    this.bottom = -10;
    this.top = 10;
  }

  //Override
  getProjectionMatrix()
  {
    const aspectRatio = this.viewport.getAspectRatio();
    mat4.ortho(this._projectionMatrix,
      this.left * aspectRatio, this.right * aspectRatio,
      this.bottom, this.top,
      this.zNear, this.zFar);
    return this._projectionMatrix;
  }

  //Override
  screenToWorld(screenX, screenY, dst)
  {
    if (!dst) dst = new Raycast3();

    const width = this.viewport.getWidth();
    const height = this.viewport.getHeight();
    const vec = this._unprojectVector;

    //Get inverted matrices
    const invertedProjection = this.getInvertedProjectionMatrix();
    const invertedView = this.getInvertedViewMatrix();

    //To Normalized Device Coords
    vec[0] = (2.0 * screenX) / width - 1.0;
    //Since screen y-axis is from top to bottom,
    //and opengl is from bottom to top, invert it.
    vec[1] = 1.0 - (2.0 * screenY) / height;

    //To Homogenous Clip Coords
    //vec[0] = vec[0];
    //vec[1] = vec[1];
    vec[2] = -1.0;
    vec[3] = 1.0;

    //To Camera Coords
    vec4.transformMat4(vec, vec, invertedProjection);
    //Forward vector (not a point)
    vec[2] = -1.0;
    vec[3] = 0.0;

    //To World Coords
    vec4.transformMat4(vec, vec, invertedView);

    //Set ray position
    vec3.copy(dst.position, vec);

    //Set ray direction
    mat4.getRotation(vec, invertedView);
    vec[2] *= -1;
    vec3.copy(dst.direction, vec);

    return dst;
  }
}

export default OrthographicCamera;
