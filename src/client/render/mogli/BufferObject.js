const NULLTYPE = 0;

class BufferObject
{
  constructor(gl, type, mode)
  {
    const handle = gl.createBuffer();

    this._gl = gl;
    this._handle = handle;

    this.type = type;
    this.drawMode = mode;

    this.dataType = null;
    this.dataNumComponents = 1;
    this.dataNormalize = false;
  }

  delete() {
    //Deleted buffers are automatically unbound
    gl.deleteBuffer(this._handle);
    this._handle = 0;
  }

  get handle() { return this._handle; }

  bind()
  {
    this._gl.bindBuffer(this.type, this._handle);
  }

  //Only required if the next possible action WILL change the active buffer type
  unbind()
  {
    this._gl.bindBuffer(this.type, NULLTYPE);
  }

  bindData(data, numComponents=1, normalize=false)
  {
    const gl = this._gl;
    if (data instanceof Float32Array)
    {
      this.dataType = gl.FLOAT;
      this.dataNumComponents = numComponents;
      this.dataNormalize = normalize;

      gl.bindBuffer(this.type, this._handle);
      gl.bufferData(this.type, data, this.drawMode);
    }
    else if (data instanceof Uint16Array)
    {
      this.dataType = gl.UNSIGNED_SHORT;
      this.dataNumComponents = numComponents;
      this.dataNormalize = normalize;

      gl.bindBuffer(this.type, this._handle);
      gl.bufferData(this.type, data, this.drawMode);
    }
    else
    {
      throw new Error("Unsupported buffer data type");
    }
    return this;
  }

  bindToVertexAttrib(attrib, stride=0, offset=0, enable=false)
  {
    const gl = this._gl;
    gl.vertexAttribPointer(attrib,
      this.dataNumComponents, this.dataType, this.dataNormalize,
      stride, offset);

    if (enable) gl.enableVertexAttribArray(attrib);
  }
}

export default BufferObject;
