export default class TileMap {
  columns: number;
  rows: number;
  tileSize: number;
  layers: any;

  constructor(width: any) {
    this.columns = 11;
    this.rows = 11;
    this.tileSize = width / 11;
    this.layers = [
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
        75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
        93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
        109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
      ],
    ];
  }

  getTile = (
    layerIndex: string | number,
    columnIndex: number,
    rowIndex: number,
  ): any => {
    return this.layers[layerIndex][rowIndex * this.columns + columnIndex];
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
