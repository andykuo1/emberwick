import BufferObject from './BufferObject.js';

class Mesh
{
  constructor(gl, elementType, positions, texcoords, normals, indices)
  {
    this.positionBuffer = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    if (positions) this.positionBuffer.bindData(positions);

    this.texcoordBuffer = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    if (texcoords) this.texcoordBuffer.bindData(texcoords);

    this.normalBuffer = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    if (normals) this.normalBuffer.bindData(normals);

    this.indexBuffer = new BufferObject(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    if (indices) this.indexBuffer.bindData(indices);

    this.elementType = elementType;
    this.vertexCount = indices.length;
  }

  delete()
  {
    this.positionBuffer.delete();
    this.texcoordBuffer.delete();
    this.normalBuffer.delete();
    this.indexBuffer.delete();
  }

  bind(shader)
  {
    shader.attachVertexBuffer(shader.attributes.a_position, this.positionBuffer, 0, 0, true);
    shader.attachVertexBuffer(shader.attributes.a_texcoord, this.texcoordBuffer, 0, 0, true);
    shader.attachVertexBuffer(shader.attributes.a_normal, this.normalBuffer, 0, 0, true);
    this.indexBuffer.bind();
  }

  draw(gl, offset=0)
  {
    gl.drawElements(this.elementType, this.vertexCount, gl.UNSIGNED_SHORT, offset);
  }
}

export default Mesh;
