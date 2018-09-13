import BufferObject from './BufferObject.js';

let REFCOUNT = 0;

class Mesh
{
  constructor(gl, positions, texcoords, normals, indices)
  {
    ++REFCOUNT;

    this.positions = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.positions.setData(positions);

    this.texcoords = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.texcoords.setData(texcoords);

    this.normals = new BufferObject(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    this.normals.setData(normals);

    this.indices = new BufferObject(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    this.indices.setData(indices);

    this.vertexCount = indices.length;
    this._gl = gl;
  }

  delete()
  {
    this.positions.delete();
    this.texcoords.delete();
    this.normals.delete();
    this.indices.delete();

    --REFCOUNT;
    if (REFCOUNT <= 0)
    {
      console.log("[" + "Mesh" + "] All resources are released! Hooray!");
    }
  }

  bind(shader)
  {
    const gl = this._gl;
    shader.attachVertexBuffer(shader.attributes.a_position, this.positions);
    shader.attachVertexBuffer(shader.attributes.a_texcoord, this.texcoords);
    shader.attachVertexBuffer(shader.attributes.a_normal, this.normals);

    this.indices.bind();
  }

  draw(gl, elementType=gl.TRIANGLES, offset=0)
  {
    gl.drawElements(elementType, this.vertexCount, gl.UNSIGNED_SHORT, offset);
  }
}

export default Mesh;
