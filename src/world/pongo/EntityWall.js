import { mat4, quat, vec3 } from 'gl-matrix';
import Collider from './Collider.js';
import Drawable from './Drawable.js';

class EntityWall
{
  static create(entityManager, posX, posY, width, height, ...tags)
  {
    let wall = entityManager.createEntity("wall");
    let collider = entityManager.addComponentToEntity(wall, Collider);
    collider.shape.position[0] = posX;
    collider.shape.position[1] = posY;
    collider.shape.halfWidth = width / 2;
    collider.shape.halfHeight = height / 2;

    let drawable = entityManager.addComponentToEntity(wall, Drawable);
    mat4.fromRotationTranslationScale(drawable.transform,
      quat.create(),
      vec3.fromValues(collider.shape.position[0], collider.shape.position[1], 0),
      vec3.fromValues(collider.shape.halfWidth * 2, collider.shape.halfHeight * 2, 1)
    );
    drawable.mesh = "cube.mesh";
    drawable.material = "rock.tex";

    return wall;
  }
}

export default EntityWall;
