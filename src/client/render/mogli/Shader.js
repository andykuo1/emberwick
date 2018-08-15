class ShaderProgram
{
  constructor(gl, vertexSource, fragmentSource)
  {
    let vertexShader = null;
    let fragmentShader = null;

    try
    {
      vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    }
    catch(e)
    {
      throw e;
    }

    try
    {
      fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    }
    catch(e)
    {
      gl.deleteShader(vertexShader);
      throw e;
    }

    const handle = gl.createProgram();
    gl.attachShader(handle, vertexShader);
    gl.attachShader(handle, fragmentShader);
    gl.linkProgram(handle);

    if (!gl.getProgramParameter(handle, gl.LINK_STATUS))
    {
      const infoLog = gl.getProgramInfoLog(handle);

      //Cleanup
      gl.detachShader(handle, vertexShader);
      gl.detachShader(handle, fragmentShader);

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      throw new Error("Unable to initailize shader program: " + infoLog);
    }

    this.attributes = getEnumeratedAttributes(gl, handle);
    this.uniforms = getEnumeratedUniforms(gl, handle);
    this._layouts = {};
    this._names = {};
    for(const name in this.attributes)
    {
      this._names[this.attributes[name]] = name;
    }

    this._handle = handle;
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._gl = gl;
  }

  delete()
  {
    const gl = this._gl;
    const handle = this._handle;

    const attribs = this.attributes;
    Object.keys(attribs).forEach(function(key){
      delete attribs[key];
    });

    const uniforms = this.uniforms;
    Object.keys(uniforms).forEach(function(key){
      delete uniforms[key];
    });

    const layouts = this._layouts;
    Object.keys(layouts).forEach(function(key){
      delete layouts[key];
    });

    const vertexShader = this._vertexShader;
    gl.detachShader(handle, vertexShader);
    gl.deleteShader(vertexShader);
    this._vertexShader = 0;

    const fragmentShader = this._fragmentShader;
    gl.detachShader(handle, fragmentShader);
    gl.deleteShader(fragmentShader);
    this._fragmentShader = 0;

    gl.deleteProgram(handle);
    this._handle = 0;
  }

  validate()
  {
    const gl = this._gl;
    const handle = this._handle;

    //Validate program for current context
    gl.validateProgram(handle);
    if (!gl.getProgramParameter(handle, gl.VALIDATE_STATUS))
    {
      return false;
    }

    return true;
  }

  setLayout(attributeName, vecSize, dataType, normalized=false)
  {
    const layout = this._layouts[attributeName] || (this._layouts[attributeName] = {});
    layout.vecSize = vecSize;
    layout.dataType = dataType;
    const typeSize = getByteSizeForAttribType(this._gl, dataType);
    layout.typeSize = typeSize;
    layout.normalized = normalized;
    layout.bytes = typeSize * vecSize;
    return layout;
  }

  getLayout(attributeName)
  {
    return this._layouts[attributeName];
  }

  removeLayout(attributeName)
  {
    delete this._layouts[attributeName];
  }

  attachVertexBuffer(attribute, bufferObject, stride=0, offset=0, enable=true)
  {
    if (typeof attribute != "number") throw new Error("Missing or unused attribute in shader");

    const name = this._names[attribute];
    const layout = this._layouts[name];
    if (!layout) throw new Error("Unable to find layout for attribute \'" + name + "\'");
    if (layout.dataType !== bufferObject.dataType) throw new Error("Mismatched data type for attribute \'" + name + "\'");

    const gl = this._gl;
    gl.vertexAttribPointer(attribute,
      layout.vecSize, layout.dataType, layout.normalized,
      stride, offset);

    if (enable) gl.enableVertexAttribArray(attribute);
  }

  get handle() { return this._handle; }

  get vertexShader() { return this._vertexShader; }

  get fragmentShader() { return this._fragmentShader; }
}

function createShader(gl, type, source)
{
  const handle = gl.createShader(type);

  gl.shaderSource(handle, source);
  gl.compileShader(handle);

  if (!gl.getShaderParameter(handle, gl.COMPILE_STATUS))
  {
    const infoLog = gl.getShaderInfoLog(handle);
    gl.deleteShader(handle);
    throw new Error('An error occured compiling shader: ' + infoLog);
  }

  return handle;
}

function getEnumeratedAttributes(gl, program)
{
  const result = {};
  const length = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for(let i = 0; i < length; ++i)
  {
    const info = gl.getActiveAttrib(program, i);
    const infoName = info.name;
    const location = gl.getAttribLocation(program, infoName);
    result[infoName] = location;
  }
  return result;
}

function getEnumeratedUniforms(gl, program)
{
  const result = {};
  const length = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for(let i = 0; i < length; ++i)
  {
    const info = gl.getActiveUniform(program, i);
    const infoName = info.name;
    const location = gl.getUniformLocation(program, infoName);
    result[infoName] = location;
  }
  return result;
}

function getByteSizeForAttribType(gl, type)
{
  switch(type)
  {
    case gl.BYTE:
    case gl.UNSIGNED_BYTE:
      return 1;
    case gl.SHORT:
    case gl.UNSIGNED_SHORT:
      return 2;
    case gl.FLOAT:
      return 4;
    default:
      throw new Error("Unknown attrib type \'" + type + "\'");
  }
}

export default ShaderProgram;
