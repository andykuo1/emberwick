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
      //Cleanup
      gl.detachShader(handle, vertexShader);
      gl.detachShader(handle, fragmentShader);

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      throw new Error("Unable to initailize shader program: " + gl.getProgramInfoLog(handle));
    }

    this.attributes = getEnumeratedAttributes(gl, handle);
    this.uniforms = getEnumeratedUniforms(gl, handle);

    this._handle = handle;
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._gl = gl;
  }

  delete() {
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
    gl.deleteShader(handle);

    throw new Error('An error occured compiling shader: ' +
      gl.getShaderInfoLog(handle));
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

export default ShaderProgram;
