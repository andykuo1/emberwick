import { vec3, vec4, mat4 } from 'gl-matrix';

import Camera from './Camera.js';
import Raycast3 from './Raycast3.js';

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

  //Override
  screenToWorld(screenX, screenY, dst)
  {
    if (!dst) dst = new Raycast3();

    const width = this.getWidth();
    const height = this.getHeight();
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
    vec4.normalize(vec, vec);

    //Set ray direction
    vec3.copy(dst.direction, vec);

    //Set ray position
    mat4.getTranslation(vec, invertedView);
    vec3.copy(dst.position, vec);

    return dst;
  }
}

export default PerspectiveCamera;
