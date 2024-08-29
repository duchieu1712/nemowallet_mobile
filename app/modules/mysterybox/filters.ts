import {
  IBoxs_FILTER_AND,
  IBoxs_FILTER_OR,
  type IBoxFilters,
  type IBoxStakedFilters,
} from "./types";
import { cast } from "../../common/utilities";
import {
  isObject,
  isArray,
  isBoolean,
  isNumber,
  isEmpty,
  includes,
  isString,
} from "lodash";

export class BoxsFilters implements IBoxFilters {
  orders: Record<string, string>;
  limit: number;
  offset: number;
  remove = (key: string): any => {
    switch (key) {
      case "limit":
      case "offset":
      case "orders":
        delete this[key];
        break;
      default:
        break;
    }
  };

  push = (key: string, value: any | unknown): any => {
    switch (key) {
      case "orders":
        if (this[key] == null) this[key] = {};
        this[key] = { ...this[key], ...value };
        break;
      case "limit":
      case "offset":
        this[key] = value;
        break;
      default:
        break;
    }
  };

  toDict = (): Record<string, any> => {
    const attrs = ["orders", "limit", "offset"];
    const ret = {};
    for (let i = 0; i < attrs.length; i++) {
      if (!isEmpty(this[attrs[i]]) || isNumber(this[attrs[i]])) {
        ret[attrs[i]] = this[attrs[i]];
      }
    }
    return ret;
  };

  toString = (): string => {
    function once(v) {
      if (isArray(v)) {
        let ret = "";
        for (let i = 0; i < v.length; i++) {
          if (ret != "") {
            ret += IBoxs_FILTER_OR;
          }
          ret += once(v[i]);
        }
        return ret;
      }
      if (isObject(v)) {
        let ret = "";
        for (const i in v) {
          if (ret != "") {
            ret += IBoxs_FILTER_AND;
          }
          ret += `${i}:${once(v[i])}`;
        }
        return ret;
      }
      if (isBoolean(v) || isNumber(v)) {
        return v.toString();
      }
      if (isString(v)) {
        return v.replace(" ", "+");
      }
      return v;
    }
    let ret = "";
    const d = this.toDict();
    for (const k in d) {
      if (ret != "") ret += "&";
      ret += `${k}=${once(d[k])}`;
    }
    return ret;
  };

  toInterface = (): IBoxFilters => {
    return cast<IBoxFilters>(this);
  };

  static fromString = (str: string): IBoxFilters => {
    function once(str: string) {
      if (str.includes(":")) {
        const ret = {};
        const _p = str?.split(IBoxs_FILTER_AND);
        for (let i = 0; i < _p.length; i++) {
          const [k, v] = _p[i]?.split(":");
          ret[k] = v;
        }
        return ret;
      }
      if (str.includes(IBoxs_FILTER_OR)) {
        return str?.split(IBoxs_FILTER_OR);
      }
      return str.replace("+", " ");
    }

    const ret: BoxsFilters = new BoxsFilters();
    const d = new URLSearchParams(str);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    for (const [k, v] of d) {
      if (["offset", "limit"].includes(k)) {
        ret.push(k, parseInt(v));
      } else {
        ret.push(k, once(v));
      }
    }
    return ret;
  };

  includes = (k: any | unknown, v: any | unknown): boolean => {
    switch (k) {
      case "orders":
        return this[k] == v;
      default:
        return includes(this[k], v);
    }
  };

  static fromObject = (object: any | unknown): IBoxFilters => {
    if (isEmpty(object)) {
      return new BoxsFilters();
    }
    return cast<BoxsFilters>(object);
  };
}

export class BoxsStakeFilters implements IBoxStakedFilters {
  id?: string;
  remove = (key: string): any => {
    switch (key) {
      case "id":
        delete this[key];
        break;
      default:
        break;
    }
  };

  push = (key: string, value: any | unknown): any => {
    switch (key) {
      case "id":
        this[key] = value;
        break;
      default:
        break;
    }
  };

  toDict = (): Record<string, any> => {
    const attrs = ["id"];
    const ret = {};
    for (let i = 0; i < attrs.length; i++) {
      if (!isEmpty(this[attrs[i]]) || isNumber(this[attrs[i]])) {
        ret[attrs[i]] = this[attrs[i]];
      }
    }
    return ret;
  };

  toString = (): string => {
    function once(v) {
      if (isArray(v)) {
        let ret = "";
        for (let i = 0; i < v.length; i++) {
          if (ret != "") {
            ret += IBoxs_FILTER_OR;
          }
          ret += once(v[i]);
        }
        return ret;
      }
      if (isObject(v)) {
        let ret = "";
        for (const i in v) {
          if (ret != "") {
            ret += IBoxs_FILTER_AND;
          }
          ret += `${i}:${once(v[i])}`;
        }
        return ret;
      }
      if (isBoolean(v) || isNumber(v)) {
        return v.toString();
      }
      if (isString(v)) {
        return v.replace(" ", "+");
      }
      return v;
    }
    let ret = "";
    const d = this.toDict();
    for (const k in d) {
      if (ret != "") ret += "&";
      ret += `${k}=${once(d[k])}`;
    }
    return ret;
  };

  toInterface = (): IBoxStakedFilters => {
    return cast<IBoxStakedFilters>(this);
  };

  static fromString = (str: string): IBoxStakedFilters => {
    function once(str: string) {
      if (str.includes(":")) {
        const ret = {};
        const _p = str.split(IBoxs_FILTER_AND);
        for (let i = 0; i < _p.length; i++) {
          const [k, v] = _p[i].split(":");
          ret[k] = v;
        }
        return ret;
      }
      if (str.includes(IBoxs_FILTER_OR)) {
        return str.split(IBoxs_FILTER_OR);
      }
      return str.replace("+", " ");
    }

    const ret: BoxsStakeFilters = new BoxsStakeFilters();
    const d = new URLSearchParams(str);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    for (const [k, v] of d) {
      if (["id"].includes(k)) {
        ret.push(k, v);
      } else {
        ret.push(k, once(v));
      }
    }
    return ret;
  };

  includes = (k: any | unknown, v: any | unknown): boolean => {
    switch (k) {
      case "id":
        return this[k] == v;
      default:
        return includes(this[k], v);
    }
  };

  static fromObject = (object: any | unknown): IBoxStakedFilters => {
    if (isEmpty(object)) {
      return new BoxsStakeFilters();
    }
    return cast<BoxsStakeFilters>(object);
  };
}
