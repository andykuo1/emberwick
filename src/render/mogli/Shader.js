class ShaderProgram
{
  constructor(gl, vertexSource, fragmentSource)
  {
    console.log("Creating shader program...");
    let vertexShader = null;
    let fragmentShader = null;

    console.log("...creating vertex shader...");
    try
    {
      vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    }
    catch(e)
    {
      throw e;
    }

    console.log("...creating fragment shader...");
    try
    {
      fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    }
    catch(e)
    {
      gl.deleteShader(vertexShader);
      throw e;
    }

    console.log("...attaching shaders...");
    const handle = gl.createProgram();
    gl.attachShader(handle, vertexShader);
    gl.attachShader(handle, fragmentShader);

    console.log("...linking shaders...");
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

    console.log("...finding attributes...");
    this.attributes = getEnumeratedAttributes(gl, handle);
    this._names = {};
    for(const name in this.attributes)
    {
      this._names[this.attributes[name]] = name;
    }

    console.log("...finding uniforms...");
    this.uniforms = getEnumeratedUniforms(gl, handle);

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

  bind()
  {
    const gl = this._gl;
    gl.useProgram(this._handle);
    for(let attributeName in this.attributes)
    {
      gl.enableVertexAttribArray(this.attributes[attributeName]);
    }
  }

  unbind()
  {
    const gl = this._gl;
    for(let attributeName in this.attributes)
    {
      gl.disableVertexAttribArray(this.attributes[attributeName]);
    }
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

    console.log("......found attribute \'" + infoName + "\'...");
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

    console.log("......found unifrom \'" + infoName + "\'...");
  }
  return result;
}

export default ShaderProgram;
