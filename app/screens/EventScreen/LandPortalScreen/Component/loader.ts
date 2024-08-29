import { Image as CanvasImage } from "react-native-canvas";

export default class Loader {
  images: any;
  constructor() {
    this.images = {};
  }

  loadImage = async (
    key: string,
    src: string,
    width: number,
    height: number,
    canvas: any,
  ): Promise<any> => {
    const image = new CanvasImage(canvas);
    canvas.width = width;
    canvas.height = height;
    image.src = src;
    image.addEventListener("load", () => {
      this.images[key] = image;
    });
  };

  getImage = (key: string | number): any => {
    return key in this.images ? this.images[key] : null;
  };
}
