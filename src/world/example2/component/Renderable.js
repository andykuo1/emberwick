import SceneNode from 'scenegraph/SceneNode.js';

const componentClass = {
  initialize: function(entityID) {
    this._sceneNode = new SceneNode();
    this.getTransform = function() {
      return this._sceneNode.transform;
    }.bind(this);
  },
  terminate: function(entityID) {
    if (this._sceneNode)
    {
      this._sceneNode.delete();
    }
    this._sceneNode = undefined;
    this.getTransform = undefined;
  }
};

export default componentClass;
