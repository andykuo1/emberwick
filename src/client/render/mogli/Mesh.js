import BufferObject from './BufferObject.js';

class Mesh
{
  constructor(gl, elementType, positions, texcoords, normals, indices)
  {
    this.positionBuffer = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    if (positions) this.positionBuffer.bindData(positions, 3, false);

    this.texcoordBuffer = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    if (texcoords) this.texcoordBuffer.bindData(texcoords, 2, false);

    this.normalBuffer = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    if (normals) this.normalBuffer.bindData(normals, 3, false);

    this.indexBuffer = new BufferObject(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    if (indices) this.indexBuffer.bindData(indices);

    this.elementType = elementType;
    this.vertexCount = indices.length;
  }

  delete() {
    this.positionBuffer.delete();
    this.texcoordBuffer.delete();
    this.normalBuffer.delete();
    this.indexBuffer.delete();
  }

  bind(shader)
  {
    this.positionBuffer.bindToVertexAttrib(shader.attributes.a_position, 0, 0, true);
    //this.texcoordBuffer.bindToVertexAttrib(shader.attributes.a_texcoord, 0, 0, true);
    //this.normalBuffer.bindToVertexAttrib(shader.attributes.a_normal, 0, 0, true);
    this.indexBuffer.bind();
  }

  draw(gl, offset)
  {
    gl.drawElements(this.elementType, this.vertexCount, gl.UNSIGNED_SHORT, offset);
  }
}

export default Mesh;
