import { vec3, mat4, quat } from 'gl-matrix';
import PerspectiveCamera from 'render/mogli/PerspectiveCamera.js';

class FreeLookCamera extends PerspectiveCamera
{
  constructor(canvas)
  {
    super(canvas);

    this.upVector = vec3.fromValues(0, 1, 0);
    this.forwardVector = vec3.fromValues(0, 0, 1);
    this.strafeVector = vec3.fromValues(1, 0, 0);

    this.eulerRotation = quat.create();

    this.moveSpeed = 0.3;
    this.sensitivity = 0.1;

    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;

    this.ignoreInputUpdate = false;
  }

  updateInput(input)
  {
    if (this.ignoreInputUpdate) return;

    const up = input.getState("moveUp");
    const down = input.getState("moveDown");
    const left = input.getState("strafeLeft");
    const right = input.getState("strafeRight");
    const forward = input.getState("moveForward");
    const backward = input.getState("moveBackward");

    const lookX = input.hasRange("lookDX") ? input.getRange("lookDX") * -1 : 0;
    const lookY = input.hasRange("lookDY") ? input.getRange("lookDY") * -1 : 0;

    const dx = left != right ? left ? 1 : -1 : 0;
    const dy = forward != backward ? forward ? 1 : -1 : 0;
    const dz = up != down ? up ? -1 : 1 : 0;

    this.updateMove(dx, dy, dz);
    this.updateLook(lookX, lookY);
  }

  onUpdate(dt)
  {
    quat.fromEuler(this.rotation, this.pitch, this.yaw, this.roll);
    quat.normalize(this.rotation, this.rotation);

    this.forwardVector[0] = this._viewMatrix[2/*m02*/];
    this.forwardVector[1] = this._viewMatrix[6/*m12*/];
    this.forwardVector[2] = this._viewMatrix[10/*m22*/];

    this.strafeVector[0] = this._viewMatrix[0/*m00*/];
    this.strafeVector[1] = this._viewMatrix[4/*m10*/];
    this.strafeVector[2] = this._viewMatrix[8/*m20*/];
  }

  updateMove(dx, dy, dz)
  {
    this.position[0] += (this.forwardVector[0] * dy + this.strafeVector[0] * dx) * this.moveSpeed;
    this.position[1] += (this.forwardVector[1] * dy + this.strafeVector[1] * dx) * this.moveSpeed;
    this.position[2] += (this.forwardVector[2] * dy + this.strafeVector[2] * dx) * this.moveSpeed;

    this.position[1] += dz * this.moveSpeed;
  }

  updateLook(dx, dy)
  {
    this.pitch += dy * this.sensitivity;
    this.yaw += dx * this.sensitivity;
  }
}

export default FreeLookCamera;
