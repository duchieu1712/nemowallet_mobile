import { toast } from "@baronha/ting";
import i18n from "../../i18n.config";

export default class Toast {
  static success = (message: string, title?: string) => {
    toast({
      title: title ?? i18n.t("common.success"),
      message,
      preset: "done",
    });
  };

  static error = (message: string, title?: string) => {
    toast({
      title: title ?? i18n.t("common.error"),
      message,
      preset: "error",
    });
  };

  static warning = (message: string, title?: string) => {
    toast({
      title: title ?? i18n.t("common.warning"),
      message,
      preset: "none",
      icon: {
        uri: require("../assets/images/images_n69/warning.png"),
        size: 24,
      },
    });
  };
}
