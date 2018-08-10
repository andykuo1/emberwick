import { vec3, mat4, vec4 } from 'gl-matrix';

class SceneNode
{
  constructor(mesh)
  {
    this.parent = null;
    this.children = [];

    this.transform = mat4.create();
    this.worldTransform = mat4.create();

    this.color = vec4.create();
    this.modelScale = vec3.fromValues(1, 1, 1);

    this.mesh = null;
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

    if (this.parent)
    {
      this.parent.removeChild(this);
    }
  }

  update(dt)
  {
    if (this.parent)
    {
      mat4.mul(this.worldTransform, this.parent.worldTransform, this.transform);
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

  addChild(sceneNode)
  {
    if (sceneNode.parent)
    {
      sceneNode.parent.removeChild(sceneNode);
    }

    this.children.push(sceneNode);
    sceneNode.parent = this;
  }

  removeChild(sceneNode)
  {
    this.children.splice(sceneNode, 1);
    sceneNode.parent = null;
  }
}

export default SceneNode;
