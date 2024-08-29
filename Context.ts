import { createContext } from "react";
import NotifService from "./NotifService";

export interface NotifServiceContextInfo {
  notif: any;
}

export const getDefaultContextInfo = () => ({
  notif: new NotifService(),
});

export const NotifServiceContext = createContext<NotifServiceContextInfo>(
  getDefaultContextInfo(),
);
