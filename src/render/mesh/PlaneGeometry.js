import Geometry from './Geometry.js';

class PlaneGeometry extends Geometry
{
  constructor(width=1, height=1, widthSegments=1, heightSegments=1)
  {
    super(null, null, null, null);

    this.width = width;
    this.height = height;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const widthSegmentLength = widthSegments + 1;
    const heightSegmentLength = heightSegments + 1;

    const segmentWidth = width / widthSegments;
    const segmentHeight = height / heightSegments;

    let x, y;

    const vertices = [];
    const normals = [];
    const uvs = [];

    for(y = 0; y < heightSegmentLength; ++y)
    {
      let offsetY = y * segmentHeight - halfHeight;
      for(x = 0; x < widthSegmentLength; ++x)
      {
        let offsetX = x * segmentWidth - halfWidth;
        vertices.push(offsetX, -offsetY, 0);
        normals.push(0, 0, 1);
        uvs.push(x / widthSegments, 1 - (y / heightSegments));
      }
    }

    const indices = [];

    for(y = 0; y < heightSegments; ++y)
    {
      for(x = 0; x < widthSegments; ++x)
      {
        let a = x + widthSegmentLength * y;
        let b = x + widthSegmentLength * (y + 1);
        let c = (x + 1) + widthSegmentLength * (y + 1);
        let d = (x + 1) + widthSegmentLength * y;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.positions = new Float32Array(vertices);
    this.texcoords = new Float32Array(uvs);
    this.normals = new Float32Array(normals);
    this.indices = new Uint16Array(indices);
  }
}

export default PlaneGeometry;
