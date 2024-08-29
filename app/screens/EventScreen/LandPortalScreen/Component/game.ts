import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../../../common/constants";

import Camera from "./camera";
import Keyboard from "./keyboard";
import Loader from "./loader";
import TileMap from "./tileMap";

export default class Game {
  context: any;
  loader: Loader;
  map: any;
  keyboard: any;
  _previousElapsed: number;
  ratio: number;
  tileAtlas: any;
  camera: any;
  currentSelectedCellX: any;
  currentSelectedCellY: any;
  currentXIndex: any;
  currentYIndex: any;
  zoneOpenToSell: any;
  canvas: any;

  constructor(canvas: any | unknown) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.loader = new Loader();
    this.map = new TileMap(canvas.width);
    this.keyboard = new Keyboard();
    this._previousElapsed = 0;
    this.ratio = 1;
    this.zoneOpenToSell = [];
  }

  init = () => {
    this.camera = new Camera(this.map, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  setRatio = (value: number): any => {
    if (value !== 0) {
      this.ratio = value;
    }
  };

  getMapTileSize = (): any => {
    return this.map.tileSize;
  };

  getMapTileSizeRatio = (): number => {
    return this.map.tileSize * this.ratio;
  };

  setZoneOpenToSell = (req: any | unknown): any => {
    this.zoneOpenToSell = req;
    this.render();
  };

  _drawGrid = (): any => {
    const width = this.map.columns * this.map.tileSize;
    const height = this.map.rows * this.map.tileSize;
    let x, y;

    for (let row = 1; row < this.map.rows; row++) {
      x = 0;
      y = row * this.getMapTileSizeRatio();
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(width, y);
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#5EE2FE";
      this.context.stroke();
    }

    for (let column = 1; column < this.map.columns; column++) {
      x = column * this.getMapTileSizeRatio();
      y = 0;
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(x, height);
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#5EE2FE";
      this.context.stroke();
    }
  };

  _drawGridNotSell = (): any => {
    for (let row = 0; row < this.map.rows; row++) {
      for (let column = 0; column < this.map.columns; column++) {
        const index =
          (this.map.columns - row - 1) * this.map.columns + (column + 1);
        // if (true) {
        if (!this.zoneOpenToSell?.includes(index)) {
          // background
          const ctx = this.context;
          ctx.beginPath();
          ctx.fillStyle = "rgba(0,0,0,0.23)";
          ctx.fillRect(
            column * this.map.tileSize,
            row * this.map.tileSize,
            this.map.tileSize,
            this.map.tileSize,
          );
          ctx.stroke();
          // Dấu X
          const paddLine = 5;
          const line = this.context;
          line.moveTo(
            column * this.map.tileSize + paddLine,
            row * this.map.tileSize + paddLine,
          );
          line.lineTo(
            column * this.map.tileSize + this.map.tileSize - paddLine,
            row * this.map.tileSize + this.map.tileSize - paddLine,
          );
          line.lineWidth = 2;
          line.strokeStyle = "rgba(167, 156, 124, 0.5)";
          line.stroke();
          //
          line.moveTo(
            column * this.map.tileSize + this.map.tileSize - paddLine,
            row * this.map.tileSize + paddLine,
          );
          line.lineTo(
            column * this.map.tileSize + paddLine,
            row * this.map.tileSize + this.map.tileSize - paddLine,
          );
          line.lineWidth = 2;
          line.strokeStyle = "rgba(167, 156, 124, 0.5)";
          line.stroke();
        }
      }
    }
  };

  initCellSelected = (): any => {
    this.currentSelectedCellX = 1;
    this.currentSelectedCellY = this.getMapTileSizeRatio() * this.map.tileSize;
    this.currentXIndex = 1;
    this.currentYIndex = this.getMapTileSizeRatio() * this.map.tileSize + 1;
  };

  setBorderCellSelected = (x: number, y: number): any => {
    this._clearBorderCellSelectdOld();
    this.currentSelectedCellX =
      Math.floor(x / this.getMapTileSizeRatio()) * this.map.tileSize;
    this.currentSelectedCellY =
      Math.floor(y / this.getMapTileSizeRatio()) * this.map.tileSize;
    this.currentXIndex = Math.floor(x / this.getMapTileSizeRatio());
    this.currentYIndex = Math.floor(y / this.getMapTileSizeRatio());
    this._drawBorderCellSelectd();
  };

  setSelectedCell = (x: number, y: number): any => {
    this._clearBorderCellSelectdOld();
    this.currentXIndex = x + 1;
    this.currentYIndex = this.map.columns - y;
    this.currentSelectedCellX =
      Math.floor(
        ((this.currentXIndex - 1) * this.map.tileSize) /
          this.getMapTileSizeRatio(),
      ) * this.map.tileSize;
    this.currentSelectedCellY =
      Math.floor(
        ((this.currentYIndex - 1) * this.map.tileSize) /
          this.getMapTileSizeRatio(),
      ) * this.map.tileSize;

    this._drawBorderCellSelectd();
  };

  getSelectedCell = (): any => {
    return (
      (this.map.columns - this.currentYIndex - 1) * this.map.columns +
      (this.currentXIndex + 1)
    );
  };

  _drawBorderCellSelectd = (): any => {
    this.context.beginPath();
    this.context.moveTo(this.currentSelectedCellX, this.currentSelectedCellY);
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#5EE2FE";
    this.context.strokeRect(
      this.currentSelectedCellX + 2,
      this.currentSelectedCellY + 2,
      this.map.tileSize - 4,
      this.map.tileSize - 4,
    );
  };

  _clearBorderCellSelectdOld = (): any => {
    if (
      this.currentSelectedCellX === null ||
      this.currentSelectedCellY === null
    )
      return;
    this.context.beginPath();
    this.context.moveTo(this.currentSelectedCellX, this.currentSelectedCellY);
    this.context.clearRect(
      this.currentSelectedCellX + 1,
      this.currentSelectedCellY + 1,
      this.map.tileSize - 2,
      this.map.tileSize - 2,
    );
    // redraw
    const index =
      (this.map.columns - this.currentYIndex - 1) * this.map.columns +
      (this.currentXIndex + 1);
    // if (true) {
    if (!this.zoneOpenToSell?.includes(index)) {
      // background
      const ctx = this.context;
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.23)";
      ctx.fillRect(
        this.currentXIndex * this.map.tileSize,
        this.currentYIndex * this.map.tileSize,
        this.map.tileSize,
        this.map.tileSize,
      );
      ctx.stroke();
      // Dấu X
      const paddLine = 5;
      const line = this.context;
      line.moveTo(
        this.currentXIndex * this.map.tileSize + paddLine,
        this.currentYIndex * this.map.tileSize + paddLine,
      );
      line.lineTo(
        this.currentXIndex * this.map.tileSize + this.map.tileSize - paddLine,
        this.currentYIndex * this.map.tileSize + this.map.tileSize - paddLine,
      );
      line.lineWidth = 2;
      line.strokeStyle = "rgba(167, 156, 124, 0.5)";
      line.stroke();
      //
      line.moveTo(
        this.currentXIndex * this.map.tileSize + this.map.tileSize - paddLine,
        this.currentYIndex * this.map.tileSize + paddLine,
      );
      line.lineTo(
        this.currentXIndex * this.map.tileSize + paddLine,
        this.currentYIndex * this.map.tileSize + this.map.tileSize - paddLine,
      );
      line.lineWidth = 2;
      line.strokeStyle = "rgba(167, 156, 124, 0.5)";
      line.stroke();
    }
  };

  reset(): any {
    // this.context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  render(): any {
    try {
      // draw map background layer
      this._drawGrid();
      if (this.currentSelectedCellX !== null) {
        this._drawBorderCellSelectd();
      }
    } catch (e) {}
  }
}
