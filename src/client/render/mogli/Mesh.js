import BufferObject from './BufferObject.js';

class Mesh
{
  constructor(gl, elementType, positions, texcoords, normals, indices)
  {
    this.positions = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.positions.bindData(positions);

    this.texcoords = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.texcoords.bindData(texcoords);

    this.normals = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.normals.bindData(normals);

    this.indices = new BufferObject(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    this.indices.bindData(indices);

    this.elementType = elementType;
    this.vertexCount = indices.length;
    this._gl = gl;
  }

  delete()
  {
    this.positions.delete();
    this.texcoords.delete();
    this.normals.delete();
    this.indices.delete();
  }

  bind(shader)
  {
    const gl = this._gl;
    shader.attachVertexBuffer(shader.attributes.a_position, this.positions);
    shader.attachVertexBuffer(shader.attributes.a_texcoord, this.texcoords);
    shader.attachVertexBuffer(shader.attributes.a_normal, this.normals);

    this.indices.bind();
  }

  draw(gl, offset=0)
  {
    gl.drawElements(this.elementType, this.vertexCount, gl.UNSIGNED_SHORT, offset);
  }
}

export default Mesh;
