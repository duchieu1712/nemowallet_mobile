import {
  CANVAS_HEIGHT_DETAIL,
  CANVAS_WIDTH_DETAIL,
  RATIO_MINI_MAP,
} from "../../../../common/constants";

import Camera from "./camera";
import Keyboard from "./keyboard";
import Loader from "./loader";
import TileMapDetail from "./tileMapDetail";

export default class Detail {
  x: number;
  y: number;
  context: any;
  loader: Loader;
  map: any;
  camera: Camera;
  keyboard: any;
  _previousElapsed: number;
  width: number;
  height: number;
  selected: boolean;
  isDrawing: boolean;
  afterMouseDown: boolean;
  ratio: number;
  tileAtlas: any;
  currentSelectedCellX: any;
  currentSelectedCellY: any;
  currentXIndex: any;
  currentYIndex: any;
  canvas: any;

  constructor(canvas: any | unknown) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.loader = new Loader();
    this.map = new TileMapDetail(canvas.width);
    this.camera = new Camera(
      this.map,
      CANVAS_WIDTH_DETAIL,
      CANVAS_HEIGHT_DETAIL,
    );
    this.keyboard = new Keyboard();
    this._previousElapsed = 0;
    this.width = this.map.getRow(CANVAS_WIDTH_DETAIL);
    this.height = this.map.getColumn(CANVAS_HEIGHT_DETAIL);
    this.selected = false;
    this.isDrawing = false;
    this.afterMouseDown = false;
    this.x = 0;
    this.y = 0;
    this.ratio = 1;
  }

  init = () => {
    for (let i = 1; i <= 2; i++) {
      this.loader.loadImage(
        `land_${i}`,
        `https://testnet.nemoverse.io/assets/land_locked_${i}.png`,
        CANVAS_WIDTH_DETAIL,
        CANVAS_HEIGHT_DETAIL,
        this.canvas,
      );
    }
    this.loader.loadImage(
      "land_3",
      "https://testnet.nemoverse.io/assets/land_unlocked.png",
      CANVAS_WIDTH_DETAIL,
      CANVAS_HEIGHT_DETAIL,
      this.canvas,
    );
    for (let i = 1; i <= 8; i++) {
      this.loader.loadImage(
        `land_${i + 3}`,
        `https://testnet.nemoverse.io/assets/land_lv${i}.png`,
        CANVAS_WIDTH_DETAIL,
        CANVAS_HEIGHT_DETAIL,
        this.canvas,
      );
    }
  };

  setLayers(mlayers: any | unknown): any {
    this.map.setLayers(mlayers);
  }

  setRatio = (value: number): any => {
    this.ratio = value;
    this.camera.setRatio(value);
  };

  setSelected = (boo: any | unknown): any => {
    this.selected = boo;
  };

  getMapTileSize = (): any => {
    return this.map.tileSize;
  };

  getMapImageSize = (): any => {
    return this.map.sizeSmallImage;
  };

  getMapTileSizeRatio = (): any => {
    return this.map.tileSize * this.ratio;
  };

  onMouseDown = (e: any | unknown): any => {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDrawing = true;
  };

  onMouseMove = (e: any | unknown): any => {
    if (this.isDrawing) {
      this.camera.updatePosition(
        (this.x - e.offsetX) / this.ratio,
        (this.y - e.offsetY) / this.ratio,
      );
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.render();
      this.afterMouseDown = true;
    }
  };

  onTouchMove = (e: any | unknown): any => {
    if (this.isDrawing) {
      this.camera.updatePosition(
        (this.x - e.touches[0].clientX) / this.ratio,
        (this.y - e.touches[0].clientY) / this.ratio,
      );
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
      this.render();
      this.afterMouseDown = true;
    }
  };

  onMouseUp = (): any => {
    if (this.isDrawing) {
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
      this.render();
    }
  };

  drawLayer = (layerIndex: number): any => {
    const startColumn = Math.floor(this.camera.x / this.getMapTileSize());
    const endColumn =
      startColumn + this.camera.width / this.getMapTileSize() + 1;
    const startRow = Math.floor(this.camera.y / this.getMapTileSize());
    const endRow = startRow + this.camera.height / this.getMapTileSize() + 1;
    const offsetX = -this.camera.x + startColumn * this.getMapTileSize();
    const offsetY = -this.camera.y + startRow * this.getMapTileSize();
    for (
      let columnIndex = startColumn;
      columnIndex < endColumn;
      columnIndex++
    ) {
      for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
        const tile = this.map.getTile(layerIndex, columnIndex, rowIndex);
        const x = (columnIndex - startColumn) * this.getMapTileSize() + offsetX;
        const y = (rowIndex - startRow) * this.getMapTileSize() + offsetY;
        if (tile && tile !== 0) {
          // 0 => empty tile
          this.context.drawImage(
            this.loader.getImage(`land_${tile}`), // image
            Math.round(x) + 1, // target x
            Math.round(y) + 1, // target y
            this.getMapImageSize(), // target width
            this.getMapImageSize(), // target height
          );
        }
      }
    }
  };

  drawRectanglesFill = (): any => {
    const ctx = this.context;
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(
      0,
      20,
      (this.map.tileSize * this.map.columns) / RATIO_MINI_MAP,
      (this.map.tileSize * this.map.rows) / RATIO_MINI_MAP,
    );
    ctx.stroke();
  };

  drawRectanglesFillLand = (): any => {
    const x = this.currentSelectedCellX / RATIO_MINI_MAP;
    const y = this.currentSelectedCellY / RATIO_MINI_MAP + 20;
    const ctx = this.context;
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 10, 10);
    ctx.stroke();
  };

  drawRectanglesBorder = (): any => {
    const width =
      (((this.map.tileSize * this.map.columns) / RATIO_MINI_MAP) *
        CANVAS_WIDTH_DETAIL) /
      (this.map.tileSize * this.map.columns);
    const height =
      (((this.map.tileSize * this.map.rows) / RATIO_MINI_MAP) *
        CANVAS_HEIGHT_DETAIL) /
      (this.map.tileSize * this.map.rows);
    const x = this.camera.x / RATIO_MINI_MAP;
    const y = this.camera.y / RATIO_MINI_MAP + 20;
    const ctx = this.context;
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "yellow";
    ctx.rect(x, y, width, height);
    ctx.stroke();
  };

  _drawGrid = (): any => {
    if (this.map.layers.length === 0) return;
    const width = this.map.columns * this.getMapTileSize();
    const height = this.map.rows * this.getMapTileSize();
    let x, y;

    for (let row = 0; row <= this.map.rows; row++) {
      x = -this.camera.x;
      y = row * this.getMapTileSize() - this.camera.y;
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(width, y);
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#0c1334";
      this.context.stroke();
    }

    for (let column = 0; column <= this.map.columns; column++) {
      x = column * this.getMapTileSize() - this.camera.x;
      y = -this.camera.y;
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(x, height);
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#0c1334";
      this.context.stroke();
    }
  };

  setBorderCellSelected = (x: number, y: number): any => {
    this._clearBorderCellSelectdOld();
    const xX = x + this.camera.x * this.ratio;
    const yY = y + this.camera.y * this.ratio;
    this.currentSelectedCellX =
      Math.floor(xX / this.getMapTileSizeRatio()) * this.getMapTileSize();
    this.currentSelectedCellY =
      Math.floor(yY / this.getMapTileSizeRatio()) * this.getMapTileSize();
    this.currentXIndex = Math.floor(xX / this.getMapTileSizeRatio());
    this.currentYIndex = Math.floor(yY / this.getMapTileSizeRatio());
    this.camera.updatePrev(xX, yY);
    this._drawBorderCellSelectd();
  };

  setSelectedCell = (landid: number): any => {
    this._clearBorderCellSelectdOld();
    if (landid % 8 === 0) {
      this.currentXIndex = 7;
    } else {
      this.currentXIndex = Math.floor(landid % 8) - 1;
    }

    if (landid % (88 * 8) === 0) {
      this.currentYIndex = 0;
    } else {
      this.currentYIndex =
        this.map.columns - Math.floor(((landid % (88 * 8)) - 1) / 88) - 1;
    }
    this.currentSelectedCellX = Math.floor(
      this.currentXIndex * this.getMapTileSizeRatio(),
    );
    this.currentSelectedCellY = Math.floor(
      this.currentYIndex * this.getMapTileSizeRatio(),
    );
    this._drawBorderCellSelectd();
  };

  getSelectedCell = (): number => {
    return (
      (this.map.columns - this.currentYIndex - 1) * this.map.columns +
      (this.currentXIndex + 1)
    );
  };

  resetCellSelectd = (): any => {
    this.currentSelectedCellX = null;
    this.currentSelectedCellY = null;
    this.currentXIndex = null;
    this.currentYIndex = null;
    this.camera.updatePrev(0, 0);
    this._clearBorderCellSelectdOld();
  };

  _drawBorderCellSelectd = (): any => {
    this.context.beginPath();
    this.context.moveTo(this.currentSelectedCellX, this.currentSelectedCellY);
    this.context.lineWidth = 4;
    this.context.strokeStyle = "#ffcc00";
    this.context.strokeRect(
      this.currentSelectedCellX + 2 - this.camera.x,
      this.currentSelectedCellY + 2 - this.camera.y,
      this.getMapTileSize() - 4,
      this.getMapTileSize() - 4,
    );
  };

  _clearBorderCellSelectdOld = (): any => {
    this.context.beginPath();
    this.context.moveTo(this.currentSelectedCellX, this.currentSelectedCellY);
    this.context.clearRect(
      this.currentSelectedCellX - this.camera.x,
      this.currentSelectedCellY - this.camera.y,
      this.map.tileSize,
      this.map.tileSize,
    );
    // redraw
    const tile = this.map.getTile(0, this.currentXIndex, this.currentYIndex);
    const x = this.currentSelectedCellX;
    const y = this.currentSelectedCellY;
    if (tile && tile !== 0) {
      // 0 => empty tile
      this.context.drawImage(
        this.loader.getImage(`land_${tile}`), // image
        Math.round(x) + 1, // target x
        Math.round(y) + 1, // target y
        this.getMapImageSize(), // target width
        this.getMapImageSize(), // target height
      );
    }
  };

  update = (): any => {
    // handle hero movement with arrow keys
    let dirX = 0;
    let dirY = 0;
    if (this.keyboard.isDown(this.keyboard.LEFT)) {
      dirX = -1;
      if (this.currentSelectedCellX > 0) {
        this.currentSelectedCellX =
          this.currentSelectedCellX - this.getMapTileSize();
      }
    }
    if (this.keyboard.isDown(this.keyboard.RIGHT)) {
      dirX = 1;
      if (
        this.currentSelectedCellX + this.getMapTileSize() <
        this.getMapTileSize() * this.map.rows
      ) {
        this.currentSelectedCellX =
          this.currentSelectedCellX + this.getMapTileSize();
      }
    }
    if (this.keyboard.isDown(this.keyboard.UP)) {
      dirY = -1;
      if (this.currentSelectedCellY > 0) {
        this.currentSelectedCellY =
          this.currentSelectedCellY - this.getMapTileSize();
      }
    }
    if (this.keyboard.isDown(this.keyboard.DOWN)) {
      dirY = 1;
      if (
        this.currentSelectedCellY + this.getMapTileSize() <
        this.getMapTileSize() * this.map.columns
      ) {
        this.currentSelectedCellY =
          this.currentSelectedCellY + this.getMapTileSize();
      }
    }

    this.camera.move(dirX, dirY);
  };

  reset(): any {
    this.context?.clearRect(0, 0, CANVAS_WIDTH_DETAIL, CANVAS_HEIGHT_DETAIL);
  }

  render(): any {
    this.reset();
    console.log("annnnn render");

    // draw map background layer
    this.drawLayer(0);
    if (this.currentSelectedCellX !== null) {
      this._drawBorderCellSelectd();
    }
  }
}
