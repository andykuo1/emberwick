import { mat4, vec3, quat } from 'gl-matrix';

import Collider from './Collider.js';

class ColliderRenderer
{
  constructor(assetManager)
  {
    this.assetManager = assetManager;
  }

  render(gl, world, camera)
  {
    this.renderColliders(gl, world.getEntityManager().getComponents(Collider), camera);
  }

  renderColliders(gl, colliders, camera)
  {
    gl.clear(gl.DEPTH_BUFFER_BIT);

    const assetManager = this.assetManager;
    const projectionMatrix = camera.getProjectionMatrix();
    const viewMatrix = camera.getViewMatrix();

    const shader = assetManager.getAssetImmediately("shader", "shader.shader");
    const texture = assetManager.getAssetImmediately("texture", "color.tex");
    const mesh = assetManager.getAssetImmediately("mesh", "cube.mesh");

    const modelMatrix = mat4.create();
    const normalMatrix = mat4.create();

    shader.bind();
    {
      gl.uniformMatrix4fv(shader.uniforms.u_projection,
          false, projectionMatrix);
      gl.uniformMatrix4fv(shader.uniforms.u_view,
          false, viewMatrix);

      texture.bind(gl.TEXTURE0);
      gl.uniform1i(shader.uniforms.u_sampler, 0);
      gl.uniform2f(shader.uniforms.u_texoffset, 0, 0);
      gl.uniform2f(shader.uniforms.u_texscale, 1, 1);

      mesh.bind(shader);

      const rotation = quat.create();
      const position = vec3.create();
      const scale = vec3.create();
      for(let collider of colliders)
      {
        position[0] = collider.shape.position[0];
        position[1] = collider.shape.position[1];
        scale[0] = collider.shape.halfWidth * 2;
        scale[1] = collider.shape.halfHeight * 2;
        mat4.fromRotationTranslationScale(modelMatrix, rotation, position, scale);

        gl.uniformMatrix4fv(shader.uniforms.u_model,
          false, modelMatrix);

        mat4.mul(normalMatrix, viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(shader.uniforms.u_normal,
          false, normalMatrix);

        mesh.draw(gl.LINE_LOOP);
      }
    }
    shader.unbind();
  }
}

export default ColliderRenderer;
