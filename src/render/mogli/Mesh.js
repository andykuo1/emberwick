import BufferObject from './BufferObject.js';

class Mesh
{
  constructor(gl)
  {
    this._gl = gl;
    this.attributes = {};
    this.elementAttribute = null;
    this.vertexCount = 0;
  }

  delete()
  {
    for(let attributeName in this.attributes)
    {
      this.attributes[attributeName].delete();
      delete this.attributes[attributeName];
    }

    if (this.elementAttribute !== null)
    {
      this.elementAttribute.delete();
      this.elementAttribute = null;
    }
  }

  bind(shader)
  {
    for(let attributeName in this.attributes)
    {
      const attributeLocation = shader.attributes[attributeName];
      this.attributes[attributeName].bind(attributeLocation);
    }

    if (this.elementAttribute !== null)
    {
      this.elementAttribute.bind();
    }
  }

  draw(elementType=this._gl.TRIANGLES, offset=0)
  {
    const gl = this._gl;
    if (this.elementAttribute !== null)
    {
      const dataType = this.elementAttribute.getBufferDataType();
      gl.drawElements(elementType, this.vertexCount, dataType, offset);
    }
    else
    {
      gl.drawArrays(elementType, offset, this.vertexCount);
    }
  }

  setElementAttribute(bufferData, usage=this._gl.STATIC_DRAW)
  {
    if (this.elementAttribute !== null) throw new Error("Element attribute already exists for mesh");

    const gl = this._gl;
    const attribute = new Attribute(gl, gl.ELEMENT_ARRAY_BUFFER, bufferData, 1, usage);
    this.elementAttribute = attribute;
    this.vertexCount = bufferData.length;
  }

  removeElementAttribute()
  {
    if (this.elementAttribute === null) throw new Error("Element attribute already exists for mesh");

    this.elementAttribute.delete();
    this.elementAttribute = null;
  }

  hasElementAttribute()
  {
    return this.elementAttribute !== null;
  }

  getElementAttribute()
  {
    return this.elementAttribute;
  }

  addAttribute(name, bufferData, vertexSize=1, usage=this._gl.STATIC_DRAW)
  {
    if (typeof this.attributes[name] !== 'undefined') throw new Error("Attribute with name \'" + name + "\' already exists for mesh");

    const gl = this._gl;
    const attribute = new Attribute(gl, gl.ARRAY_BUFFER, bufferData, vertexSize, usage);
    this.attributes[name] = attribute;
  }

  removeAttribute(name)
  {
    if (typeof this.attributes[name] === 'undefined') throw new Error("Cannot find attribute with name \'" + name + "\' for mesh");

    this.attributes[name].delete();
    delete this.attributes[name];
  }

  hasAttribute(name)
  {
    return this.attributes[name] !== null;
  }

  getAttribute(name)
  {
    return this.attributes[name];
  }
}

class Attribute
{
  constructor(gl, type, data, vertexSize, usage, normalized=false)
  {
    this._gl = gl;

    this.vertexSize = vertexSize;
    this.normalized = normalized;

    this.bufferObject = new BufferObject(gl, type, usage);
    this.bufferObject.setData(data);
  }

  delete()
  {
    this.bufferObject.delete();
  }

  bind(shaderAttributeLocation=-1, stride=0, offset=0)
  {
    const gl = this._gl;
    const bufferType = this.bufferObject.type;
    gl.bindBuffer(bufferType, this.bufferObject.handle);

    if (bufferType === gl.ARRAY_BUFFER)
    {
      if (shaderAttributeLocation < 0) throw new Error("Invalid attribute location");
      gl.vertexAttribPointer(shaderAttributeLocation, this.vertexSize, this.bufferObject.dataType, this.normalized, stride, offset);
    }
  }

  unbind()
  {
    const bufferType = this.bufferObject.type;
    gl.bindBuffer(bufferType, 0);
  }

  setBufferData(data)
  {
    this.bufferObject.setData(data);
  }

  updateBufferData(data, offset=0)
  {
    this.bufferObject.updateData(data, offset);
  }

  getBufferDataType()
  {
    return this.bufferObject.dataType;
  }
}

export default Mesh;
