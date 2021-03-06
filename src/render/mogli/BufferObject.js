class BufferObject
{
  constructor(gl, type, usage)
  {
    const handle = gl.createBuffer();

    this._gl = gl;
    this._handle = handle;

    this.type = type;
    this.usage = usage;

    this.dataType = gl.BYTE;
  }

  delete()
  {
    const gl = this._gl;
    const handle = this._handle;

    //Deleted buffers are automatically unbound
    gl.deleteBuffer(handle);
    this._handle = null;
  }

  get handle() { return this._handle; }

  bind()
  {
    this._gl.bindBuffer(this.type, this._handle);
  }

  //Only required if the next possible action WILL change the active buffer type
  unbind()
  {
    this._gl.bindBuffer(this.type, null);
  }

  setData(data)
  {
    const gl = this._gl;
    if (data instanceof Float32Array)
    {
      this.dataType = gl.FLOAT;

      gl.bindBuffer(this.type, this._handle);
      gl.bufferData(this.type, data, this.usage);
    }
    else if (data instanceof Uint16Array)
    {
      this.dataType = gl.UNSIGNED_SHORT;

      gl.bindBuffer(this.type, this._handle);
      gl.bufferData(this.type, data, this.usage);
    }
    else
    {
      throw new Error("Unsupported buffer data type");
    }
    return this;
  }

  updateData(data, offset=0)
  {
    const gl = this._gl;
    gl.bindBuffer(this.type, this._handle);
    gl.bufferSubData(this.type, offset, data);
    return this;
  }
}

export default BufferObject;
