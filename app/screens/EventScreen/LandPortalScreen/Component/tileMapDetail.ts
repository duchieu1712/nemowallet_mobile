export default class TileMapDetail {
  columns: number;
  rows: number;
  tileSize: number;
  sizeSmallImage: number;
  layers: any;

  constructor(width: any) {
    this.columns = 8;
    this.rows = 8;
    this.tileSize = width / 8;
    this.sizeSmallImage = width / 8;
    this.layers = [
      // [
      //     1, 2, 2, 1, 2, 1, 3, 1,
      //     1, 2, 3, 1, 1, 2, 1, 1,
      //     1, 2, 1, 1, 1, 1, 1, 3,
      //     1, 2, 3, 1, 3, 1, 2, 1,
      //     1, 2, 3, 1, 1, 2, 1, 1,
      //     1, 1, 2, 1, 2, 1, 2, 1,
      //     1, 3, 3, 1, 1, 1, 1, 1,
      //     1, 2, 3, 1, 1, 1, 2, 1,
      // ]
    ];
  }

  setLayers(mlayers: any | unknown): any {
    this.layers = [mlayers];
  }

  getTile = (
    layerIndex: string | number,
    columnIndex: number,
    rowIndex: number,
  ): any => {
    if (this.layers.length === 0) return 0;
    return this.layers[layerIndex][
      (this.columns - rowIndex - 1) * this.columns + columnIndex
    ];
  };

  isSolidTileAtXY = (x: number, y: number): any => {
    const column = Math.floor(x / this.tileSize);
    const row = Math.floor(y / this.tileSize);
    return this.layers.reduce((res: any, layer: any, layerIndex: any) => {
      const tile = this.getTile(layerIndex, column, row);
      const isSolid = tile === 3 || tile === 5;
      return res || isSolid;
    }, false);
  };

  getColumn = (x: number): number => {
    return Math.floor(x / this.tileSize);
  };

  getRow = (y: number): number => {
    return Math.floor(y / this.tileSize);
  };

  getX = (column: number): number => {
    return column * this.tileSize;
  };

  getY = (row: number): number => {
    return row * this.tileSize;
  };
}
