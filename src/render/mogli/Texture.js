class Texture
{
  constructor(gl, wrapMode=gl.CLAMP_TO_EDGE, minMagFilter=gl.NEAREST)
  {
    const handle = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, handle);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 0, 0, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      width, height, border, srcFormat, srcType, pixel);

    this._width = width;
    this._height = height;

    this._gl = gl;
    this._handle = handle;

    this._wrapMode = wrapMode;
    this._minMagFilter = minMagFilter;
  }

  delete()
  {
    const gl = this._gl;
    const handle = this._handle;
    gl.deleteTexture(handle);
    this._handle = 0;
  }

  setData(imageData)
  {
    const gl = this._gl;
    const handle = this._handle;

    if (imageData instanceof Image)
    {
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = imageData.width;
      const height = imageData.height;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      gl.bindTexture(gl.TEXTURE_2D, handle);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        /*width, height, border,*/ srcFormat, srcType, imageData);

      this._width = width;
      this._height = height;

      if (isPowerOf2(width) && isPowerOf2(height))
      {
        gl.generateMipmap(gl.TEXTURE_2D);
      }

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minMagFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._minMagFilter);
    }
    else
    {
      throw new Error("Unknown image data type is not supported");
    }
  }

  bind(textureUnit)
  {
    const gl = this._gl;
    const handle = this._handle;
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, handle);
  }

  getWidth()
  {
    return this._width;
  }

  getHeight()
  {
    return this._height;
  }
}

function isPowerOf2(value)
{
  return (value & (value - 1)) == 0;
}

export default Texture;
