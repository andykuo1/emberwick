import { vec3, mat4, quat } from 'gl-matrix';

const componentClass = {
  initialize: function(src) {
    src.position = vec3.create();
    src.rotation = quat.create();
    src.scale = vec3.fromValues(1, 1, 1);
    src.getTransformation = function(dst) {
      return mat4.fromRotationTranslationScale(dst,
        this.rotation,
        this.position,
        this.scale
      );
    }.bind(src);
  },
  terminate: function(src) {
    src.position = undefined;
    src.rotation = undefined;
    src.scale = undefined;
    src.getTransformation = undefined;
  }
};

export default componentClass;
