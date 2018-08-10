import Renderer from 'world/Renderer.js';

class World
{
  constructor()
  {
    this.renderer = new Renderer();
  }

  update(dt)
  {
    this.renderer.update(dt);
  }

  render(gl)
  {
    this.renderer.render(gl);
  }
}

export default World;
