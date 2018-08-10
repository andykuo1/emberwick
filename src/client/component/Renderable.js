const componentClass = {
  initialize: function() {
    this._sceneNode = null;
    this.getTransform = function() {
      return this._sceneNode.transform;
    }.bind(this);
  },
  terminate: function() {
    this._sceneNode = undefined;
    this.getTransform = undefined;
  }
};

export default componentClass;
