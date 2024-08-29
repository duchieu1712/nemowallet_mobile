// import { DEFAULT_CHAINID } from './constants'
import { CHAINID_COGI } from "./constants";
export class ClassWithStaticMethod {
  //
  static NEMO_WALLET_CHAINID = CHAINID_COGI;
  // Default CogiChain
  static USER_INFO: any = {};
  static SET_USER_INFO = (value: any) => {
    this.USER_INFO = value;
  };

  // Default CogiChain
  static LINK_CALL_BACK: any = {};
  static SET_LINK_CALL_BACK = (value: any) => {
    this.LINK_CALL_BACK = value;
  };

  // static STATIC_DEFAULT_CHAINID = DEFAULT_CHAINID
  // Default CogiChain
  static STATIC_DEFAULT_CHAINID = CHAINID_COGI;
  static SET_STATIC_DEFAULT_CHAINID = (value: number) => {
    this.STATIC_DEFAULT_CHAINID = value;
  };

  // Pin
  static PIN_APPROVE = {
    timestamp: 0,
    pin: "",
  };

  static SET_PIN_APPROVE = (pin_approve: any) => {
    this.PIN_APPROVE = pin_approve;
  };

  //
  static query = {
    refer_id: "",
    t: "",
    tag: "",
    link: "",
  };

  static getQuery = () => {
    let res = "";
    if (this.query.t != null && this.query.t != "") {
      res += "&t=" + this.query.t;
    }
    if (this.query.refer_id != null && this.query.refer_id != "") {
      res += "&refer_id=" + this.query.refer_id;
    }
    if (this.query.tag != null && this.query.tag != "") {
      res += "&tag=" + this.query.tag;
    }
    if (this.query.link != null && this.query.link != "") {
      res += "&link=" + this.query.link;
    }
    return res;
  };
}
