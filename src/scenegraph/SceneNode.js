import { vec3, mat4, vec4 } from 'gl-matrix';

class SceneNode
{
  constructor(mesh)
  {
    this._parent = null;
    this.children = [];

    this.transform = mat4.create();
    this.worldTransform = mat4.create();

    this.color = vec4.create();
    this.modelScale = vec3.fromValues(1, 1, 1);

    this.mesh = mesh;
  }

  delete() {
    if (this.isParent())
    {
      for(const child of this.children)
      {
        child.delete();
      }
      this.children.length = 0;
    }

    this.setParent(null);
  }

  update(dt)
  {
    if (this._parent)
    {
      mat4.mul(this.worldTransform, this._parent.worldTransform, this.transform);
    }
    else
    {
      mat4.copy(this.worldTransform, this.transform);
    }

    for(const child of this.children)
    {
      child.update(dt);
    }
  }

  isParent()
  {
    return this.children.length > 0;
  }

  setParent(sceneNode)
  {
    if (this._parent != null)
    {
      this._parent.children.splice(this, 1);
    }

    if (sceneNode != null)
    {
      sceneNode.children.push(this);
    }
    this._parent = sceneNode;
  }

  getParent()
  {
    return this._parent;
  }
}

export default SceneNode;
