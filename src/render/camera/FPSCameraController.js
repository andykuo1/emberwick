import { vec3, quat } from 'gl-matrix';

class FPSCameraController
{
  constructor(camera)
  {
    this._camera = camera;

    this.upVector = vec3.fromValues(0, 1, 0);
    this.forwardVector = vec3.fromValues(0, 0, 1);
    this.strafeVector = vec3.fromValues(1, 0, 0);

    this.eulerRotation = quat.create();

    this.moveSpeed = 0.3;
    this.sensitivity = 1.0;

    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;

    this.moveX = 0;
    this.moveY = 0;
    this.moveZ = 0;

    this.lookX = 0;
    this.lookY = 0;
  }

  onInputUpdate(input)
  {
    this.moveX = (input.getState("strafeLeft") ? 1 : 0) + (input.getState("strafeRight") ? -1 : 0);
    this.moveY = (input.getState("moveForward") ? 1 : 0) + (input.getState("moveBackward") ? -1 : 0);
    this.moveZ = (input.getState("moveDown") ? 1 : 0) + (input.getState("moveUp") ? -1 : 0);

    if (input.hasRange("lookDX")) this.lookX = input.getRange("lookDX") * -1;
    if (input.hasRange("lookDY")) this.lookY = input.getRange("lookDY") * -1;
  }

  onUpdate(dt)
  {
    const cameraRotation = this._camera.rotation;
    quat.fromEuler(cameraRotation, this.pitch, this.yaw, this.roll);
    quat.normalize(cameraRotation, cameraRotation);

    const cameraView = this._camera._viewMatrix;
    this.forwardVector[0] = cameraView[2/*m02*/];
    this.forwardVector[1] = cameraView[6/*m12*/];
    this.forwardVector[2] = cameraView[10/*m22*/];
    this.strafeVector[0] = cameraView[0/*m00*/];
    this.strafeVector[1] = cameraView[4/*m10*/];
    this.strafeVector[2] = cameraView[8/*m20*/];

    const moveAmount = this.moveSpeed * dt;
    this.translate(this.moveX * moveAmount, this.moveY * moveAmount, this.moveZ * moveAmount);

    const lookAmount = this.sensitivity * dt;
    this.yaw += this.lookX * lookAmount;
    this.pitch += this.lookY * lookAmount;
    this.lookX = 0;
    this.lookY = 0;
  }

  translate(dx, dy, dz)
  {
    const position = this._camera.position;
    position[0] += this.forwardVector[0] * dy + this.strafeVector[0] * dx;
    position[1] += this.forwardVector[1] * dy + this.strafeVector[1] * dx;
    position[2] += this.forwardVector[2] * dy + this.strafeVector[2] * dx;

    position[1] += dz;
  }

  setPosition(x=0, y=0, z=0)
  {
    const position = this._camera.position;
    position[0] = x;
    position[1] = y;
    position[2] = z;
  }

  getCamera()
  {
    return this._camera;
  }
}

export default FPSCameraController;
