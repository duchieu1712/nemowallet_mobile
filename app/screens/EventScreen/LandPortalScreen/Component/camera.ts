export default class Camera {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  width: number;
  height: number;
  maxX: number;
  maxY: number;
  SPEED: any;
  map: any;
  ratio: number;

  constructor(
    map: { columns: number; tileSize: number; rows: number },
    width: number,
    height: number,
  ) {
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.columns * map.tileSize - width;
    this.maxY = map.rows * map.tileSize - height;
    this.map = map;
    this.ratio = 1;
  }

  setRatio = (value: number): any => {
    this.ratio = value;
    this.maxX = this.map.columns * this.map.tileSize - this.width;
    this.maxY = this.map.rows * this.map.tileSize - this.height;
  };

  getMapTileSizeRatio = (): any => {
    return this.map.tileSize * this.ratio;
  };

  getMapTileSize = (): any => {
    return this.map.tileSize * this.ratio;
  };

  move = (dirX: number, dirY: number): any => {
    if (dirX === 0 && dirY === 0) return;
    const tempX = this.prevX + dirX * this.getMapTileSize();
    const tempY = this.prevY + dirY * this.getMapTileSize();
    if (
      tempX <= this.map.columns * this.getMapTileSize() &&
      tempX >= 0 &&
      tempY <= this.map.rows * this.getMapTileSize() &&
      tempY >= 0
    ) {
      // move camera
      this.prevX = tempX;
      this.prevY = tempY;
      // scroll left
      if (this.prevX < this.width * this.ratio) {
        this.x = 0;
      } else {
        this.x = this.prevX;
      }
      if (this.prevY < this.height * this.ratio) {
        this.y = 0;
      } else {
        this.y = this.prevY;
      }
      // clamp right
      this.x = Math.max(0, Math.min(this.x, this.maxX));
      this.y = Math.max(0, Math.min(this.y, this.maxY));
    }
  };

  updatePrev = (x: number, y: number): any => {
    this.prevX = x;
    this.prevY = y;
  };

  updatePosition = (x: number, y: number): any => {
    if (this.x + x >= 0 && this.x + x <= this.maxX) {
      this.x = this.x + x;
    }
    if (this.y + y >= 0 && this.y + y <= this.maxY) {
      this.y = this.y + y;
    }
  };
}
