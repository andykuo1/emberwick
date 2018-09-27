import { mat4 } from 'gl-matrix';

class SceneGraphRenderer
{
  constructor(assetManager)
  {
    this.assetManager = assetManager;
  }

  render(gl, sceneGraph, camera)
  {
    this.renderScene(gl, sceneGraph, camera, "phong.shader");
  }

  renderScene(gl, sceneGraph, camera, shaderAsset)
  {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const assetManager = this.assetManager;
    const projectionMatrix = camera.getProjectionMatrix();
    const viewMatrix = camera.getViewMatrix();

    const shader = assetManager.getAssetImmediately("shader", shaderAsset) || assetManager.getAssetImmediately("shader", "shader.shader");
    const texture = assetManager.getAssetImmediately("texture", "color.tex");

    shader.bind();
    gl.uniformMatrix4fv(
        shader.uniforms.u_projection,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        shader.uniforms.u_view,
        false,
        viewMatrix);
    gl.uniform1i(shader.uniforms.u_sampler, 0);

    texture.bind(gl.TEXTURE0);

    let modelMatrix = mat4.create();
    let normalMatrix = mat4.create();
    let nextNodes = [];
    if (sceneGraph)
    {
      nextNodes.push(sceneGraph);
    }

    const MAX_DEPTH = 100;
    let depth = 0;
    while(nextNodes.length > 0)
    {
      ++depth; if (depth > MAX_DEPTH) break;

      const node = nextNodes.pop();
      const meshID = node.mesh;
      const textureID = node.material;
      if (textureID)
      {
        const texture = assetManager.getAssetImmediately("texture", textureID);
        texture.bind(gl.TEXTURE0);
      }

      if (meshID)
      {
        const mesh = assetManager.getAssetImmediately("mesh", meshID);
        if (mesh)
        {
          mat4.scale(modelMatrix, node.worldTransform, node.modelScale);

          gl.uniformMatrix4fv(
            shader.uniforms.u_model,
            false,
            modelMatrix);

          mat4.mul(normalMatrix, viewMatrix, modelMatrix);
          mat4.invert(normalMatrix, normalMatrix);
          mat4.transpose(normalMatrix, normalMatrix);

          gl.uniformMatrix4fv(
            shader.uniforms.u_normal,
            false,
            normalMatrix
          );

          mesh.bind(shader);
          mesh.draw();
        }
      }

      if (node.isParent())
      {
        const length = node.children.length;
        for(let i = length - 1; i >= 0; --i)
        {
          nextNodes.push(node.children[i]);
        }
      }
    }

    shader.unbind();
  }
}

export default SceneGraphRenderer;
