const FPS = {
  _element: null,
  elapsed: 0,
  frames: 0,
  update(dt, fps=60) {
    if (!this._element)
    {
      this._element = document.createElement('div');
      this._element.id = "fps-counter";
      this._element.innerHTML = "FPS: 0/0";
      this._element.style.fontFamily = "monospace";
      this._element.style.position = "absolute";
      this._element.style.right = "0";
      this._element.style.top = "0";
      this._element.style.zIndex = "1000";
      this._element.style.color = "white";
      document.body.appendChild(this._element);
    }

    ++this.frames;
    if ((this.elapsed += dt) >= 1000)
    {
      const label = "FPS: " + this.frames + "/" + fps;
      this._element.innerHTML = label;

      this.frames = 0;

      this.elapsed = (this.elapsed - 1000) % 1000;
    }
  }
};
