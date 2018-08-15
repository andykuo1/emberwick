class AssetLoader
{
  constructor(url, type="")
  {
    this.response = null;
    this.responseType = type;
    this.url = url;

    this._requestLoad = null;
    this._requestProgress = null;
    this._requestStop = null;
  }

  fetch()
  {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.responseType = this.responseType;
      request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {
            this.processResponse(request.response)
              .then((response) => {
                if (this._requestLoad) this._requestLoad(response);

                this.response = response;

                if (this._requestStop) this._requestStop();

                resolve(response);
              });
          }
          else
          {
            if (this._requestStop) this._requestStop();

            reject(new Error("Failed to load resource from server - " + request.status));
          }
        }
      };
      request.onerror = (e) => {
        if (this._requestStop) this._requestStop();

        reject(new Error("Failed to load resource from server due to network error"));
      };
      request.oncancel = (e) => {
        if (this._requestStop) this._requestStop();
      };
      request.onprogress = (e) => {
        if (e.lengthComputable)
        {
          if (this._requestProgress)
          {
            this._requestProgress.call(null, e.loaded, e.total);
          }
        }
      };
      request.open('GET', this.url, true);
      request.send();
    });
  }

  abort()
  {
    this.request.abort();
  }

  processResponse(response)
  {
    return Promise.resolve(response);
  }

  onLoad(callback)
  {
    this._requestLoad = callback;
    return this;
  }

  onProgress(callback)
  {
    this._requestProgress = callback;
    return this;
  }

  onStop(callback)
  {
    this._requestStop = callback;
    return this;
  }
}

export default AssetLoader;
