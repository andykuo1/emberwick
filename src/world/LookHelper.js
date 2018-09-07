import { vec3, mat4, vec4 } from 'gl-matrix';

class LookHelper
{
  constructor()
  {
    this.camera = null;
    this.vector = vec3.create();

    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;

    this.invertedProjectionMatrix = mat4.create();
    this.invertedViewMatrix = mat4.create();
  }

  setX(x)
  {
    this.x = x;
  }

  setY(y)
  {
    this.y = y;
  }

  setCamera(camera)
  {
    this.camera = camera;
  }

  getVector()
  {
    return this.vector;
  }

  update()
  {
    if (!this.camera) return;

    this.width = this.camera.getWidth();
    this.height = this.camera.getHeight();
    mat4.invert(this.invertedProjectionMatrix, this.camera.getProjectionMatrix());
    mat4.invert(this.invertedViewMatrix, this.camera.getViewMatrix());

    const x = this.x;
    const y = this.y;
    const width = this.width;
    const height = this.height;
    const invProjection = this.invertedProjectionMatrix;
    const invView = this.invertedViewMatrix;

    const vec = vec4.create();
    const deviceCoords = this.getNormalizedDeviceCoords(x, y, width, height, vec);
    const clipCoords = this.getHomogenousClipCoords(deviceCoords, vec);
    const cameraCoords = this.getCameraCoords(invProjection, clipCoords, vec);
    const worldCoords = this.getWorldCoords(invView, cameraCoords, this.vector);
    
    vec3.sub(this.vector, this.vector, this.camera.position);
  }

  getWorldCoords(invertedViewMatrix, cameraCoords, dst=vec3.create())
  {
    const vec = vec4.create();
    vec4.transformMat4(vec, cameraCoords, invertedViewMatrix);
    dst[0] = vec[0];
    dst[1] = vec[1];
    dst[2] = vec[2];
    vec3.normalize(dst, dst);
    return dst;
  }

  getCameraCoords(invertedProjectionMatrix, clipCoords, dst=vec4.create())
  {
    vec4.transformMat4(dst, clipCoords, invertedProjectionMatrix);
    //Forward vector (not a point)
    dst[2] = -1.0;
    dst[3] = 0.0;
    return dst;
  }

  getHomogenousClipCoords(deviceCoords, dst=vec4.create())
  {
    dst[0] = deviceCoords[0];
    dst[1] = deviceCoords[1];
    dst[2] = -1.0;
    dst[3] = 1.0;
    return dst;
  }

  getNormalizedDeviceCoords(x, y, width, height, dst=vec2.create())
  {
    dst[0] = (2.0 * x) / width - 1.0;
    //Since screen y-axis is from top to bottom,
    //and opengl is from bottom to top, invert it.
    dst[1] = 1.0 - (2.0 * y) / height;
    return dst;
  }
}

export default LookHelper;
