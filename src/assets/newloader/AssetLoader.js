class AssetLoader
{
  constructor(responseType)
  {
    this.responseType = responseType;
  }

  load(ctx)
  {
    const request = new XMLHttpRequest();
    ctx.init(this, request);

    return new Promise((resolve, reject) => {
      request.responseType = this.responseType;
      request.onload = (e) => {
        if (request.readyState === XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {
            ctx.setResult(response);

            resolve(response);
          }
          else
          {
            ctx.setResult(null);

            const error = new Error("Failed to load resource from server - " + request.status);
            ctx.setError(error);
            reject(error);
          }
        }
      };
      request.onerror = (e) => {
        ctx.setResult(null);

        const error = new Error("Failed to load resource from server due to network error");
        ctx.setError(error);
        reject(error);
      };
      request.onabort = (e) => {
        ctx.setResult(null);

        reject("Aborted loading resource");
      };
      request.onprogress = (e) => {
        if (e.lengthComputable)
        {
          ctx.updateProgress(e.loaded, e.total);
        }
      };

      request.open('GET', this.url, true);
      request.send();
    });
  }

  unload(ctx)
  {
    if (ctx.isActive())
    {
      ctx.src.abort();
    }
  }
}
