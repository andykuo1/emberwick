class Texture
{
  constructor(gl, url)
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

    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, handle);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, image);

      if (isPowerOf2(image.width) && isPowerOf2(image.height))
      {
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      else
      {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;

    this._gl = gl;
    this._handle = handle;
  }

  bind(textureUnit)
  {
    const gl = this._gl;
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this._handle);
  }
}

function isPowerOf2(value)
{
  return (value & (value - 1)) == 0;
}

export default Texture;
