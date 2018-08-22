class ImageLoader extends AssetLoader
{
  constructor(url)
  {
    super(url, "blob");
  }

  //Override
  load(ctx)
  {
    return super.load(ctx).then((data) => {
      return new Promise((resolve, reject) => {
        const imageURL = URL.createObjectURL(data);
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(imageURL);

          resolve(image);
        };
        image.src = imageURL;
      });
    });
  }
}

export default ImageLoader;
