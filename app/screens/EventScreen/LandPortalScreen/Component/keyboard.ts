export default class Keyboard {
  LEFT: number;
  RIGHT: number;
  UP: number;
  DOWN: number;
  _keys: any;

  constructor() {
    this.LEFT = 37;
    this.RIGHT = 39;
    this.UP = 38;
    this.DOWN = 40;
    this._keys = {};
  }

  listenForEvents = (keys: any[]): any => {
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);

    keys.forEach((key) => {
      this._keys[key] = false;
    });
  };

  _onKeyDown = (event: any | unknown): any => {
    const keyCode = event.keyCode;
    if (keyCode in this._keys) {
      event.preventDefault();
      this._keys[keyCode] = true;
    }
  };

  _onKeyUp = (event: any | unknown): any => {
    const keyCode = event.keyCode;
    if (keyCode in this._keys) {
      event.preventDefault();
      this._keys[keyCode] = false;
    }
  };

  isDown = (keyCode: string | number): any => {
    /* eslint no-unsafe-negation: "error" */
    if ("" + !keyCode in this._keys) {
      throw new Error(`Keycode  ${keyCode} is not being listened to`);
    }
    return this._keys[keyCode];
  };
}
