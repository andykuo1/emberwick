import { mat4 } from 'gl-matrix';

import Drawable from './Drawable.js';

class DrawableRenderer
{
  constructor(assetManager)
  {
    this.assetManager = assetManager;
  }

  render(gl, world, camera)
  {
    this.renderDrawables(gl, world.getEntityManager().getComponentsByClass(Drawable), camera);
  }

  renderDrawables(gl, drawables, camera)
  {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const assetManager = this.assetManager;
    const projectionMatrix = camera.getProjectionMatrix();
    const viewMatrix = camera.getViewMatrix();

    const shader = assetManager.getAssetImmediately("shader", "phong.shader");
    const texture = assetManager.getAssetImmediately("texture", "color.tex");

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

      for(let drawable of drawables)
      {
        if (!drawable.visible) continue;
        
        const meshID = drawable.mesh;
        const textureID = drawable.material;
        const transform = drawable.transform;

        if (textureID)
        {
          const texture = assetManager.getAssetImmediately("texture", textureID);
          texture.bind(gl.TEXTURE0);
        }

        if (meshID)
        {
          const mesh = assetManager.getAssetImmediately("mesh", meshID);
          mesh.bind(shader);

          mat4.copy(modelMatrix, transform);

          gl.uniformMatrix4fv(shader.uniforms.u_model,
            false, modelMatrix);

          mat4.mul(normalMatrix, viewMatrix, modelMatrix);
          mat4.invert(normalMatrix, normalMatrix);
          mat4.transpose(normalMatrix, normalMatrix);

          gl.uniformMatrix4fv(shader.uniforms.u_normal,
            false, normalMatrix);

          const elementType = drawable.drawMode === "wireframe" ? gl.LINE_LOOP : gl.TRIANGLES;
          mesh.draw(elementType);
        }
      }
    }
    shader.unbind();
  }
}

export default DrawableRenderer;
