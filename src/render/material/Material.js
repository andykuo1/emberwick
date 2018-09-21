import { vec2, vec4 } from 'gl-matrix';

class Material
{
  constructor(shader, texture)
  {
    this.shader = shader;
    this.texture = texture;

    this.color = vec4.create();
    this.textureOffset = vec2.create();
    this.textureScale = vec2.create();
  }
}

export default Material;
