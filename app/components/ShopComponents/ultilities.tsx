import { DASHBOARD_9D, QUALITY, QUALITY_GALIX } from "../../themes/theme";
import {
  getRarerityForFlashPoint,
  getRarerityForGalixCity,
  getRarerityForMarswar,
} from "../../common/utilities";
import { powerOrStar, qualityNFTbyColorText } from "./configs";
import { type Nft } from "../../modules/graphql/types/generated";
import { SERVICE_ID } from "../../common/enum";

export const getTitle = (symbol: any) => {
  let temp = "";
  switch (symbol) {
    case "ABOX":
      temp = `Open Ancient Box to get all the following items: 
      - Wood Dragon Order Chest (NFT) x1
      - Super Rare Tablet Box (NFT) x1
      - Sect Transfer Box (NFT) x1
      And have 10% chance to get special NEMO Chest
      - Golden NEMO Treasure (NFT) x1:  Open will randomly receive between 50 and 5,000 NEMO `;
      break;
    case "DBOX":
      temp = `Open Divine Box to get all the following items:
      - Water Spirit Piece Chest (NFT) x1 
      - Random God Beast Treasure (NFT) x1
      - Noble Outfit Piece Box (NFT) x1
      - Ancient Wheel Piece Chest (NFT) x1
      And have 10% chance to get special NEMO Chest
      - Diamond NEMO Random Chest (NFT) x1: Open will randomly receive between 100 and 10,000 NEMO`;
      break;
  }
  return temp;
};

export const getTotalBox = (symbol: any, stage: any) => {
  switch (symbol) {
    case "ABOX":
      return [80, 20, 80, 0, 100, 20, 80][stage];
      return [100, 20, 80, 0, 100, 20, 100][stage];
    case "DBOX":
      return [20, 5, 20, 0, 25, 5, 25][stage];
      return [25, 5, 20, 0, 25, 5, 25][stage];
  }
  return "";
};

export const getPlusButton = (e: any | string): any => {
  let value = e;
  const temp = parseInt(value);
  if (!isNaN(temp)) {
    value = (temp + 1).toString();
    return value;
  } else return value;
};

export const getMinusButton = (e: any | string): any => {
  let value = e;
  const temp = parseInt(value);
  if (!isNaN(temp) && temp > 1) {
    value = (temp - 1).toString();
    return value;
  } else return value;
};

export function getGameField(serviceID: any) {
  return powerOrStar.find((e) => e.serviceID == serviceID);
}

export function getQualityNFT({
  serviceID,
  item,
  itemDMetadata,
  isDashboard = false,
}: {
  serviceID: SERVICE_ID;
  item?: Nft | any;
  itemDMetadata?: any;
  isDashboard?: boolean;
}) {
  if (qualityNFTbyColorText.includes(serviceID)) {
    return isDashboard
      ? DASHBOARD_9D[itemDMetadata?.quality?.value]
      : QUALITY[itemDMetadata?.quality?.value];
  } else {
    return serviceID == SERVICE_ID._GALIXCITY
      ? QUALITY_GALIX[getRarerityForGalixCity(item)]
      : serviceID == SERVICE_ID._FLASHPOINT
        ? QUALITY_GALIX[getRarerityForFlashPoint(item)]
        : QUALITY_GALIX[getRarerityForMarswar(itemDMetadata?.rarity?.value)];
  }
}

export const general_display_color = (value: string) => {
  switch (value) {
    case "number":
      return "#75A14C";
    case "Normal":
      return "#534741";
    case "Excellent":
      return "#0082bf";
    case "Preeminent":
      return "#8f3dff";
    case "Outstanding":
      return "#d7b600";
    case "Perfect":
      return "#ff8400";
    default:
      return "#75a14c";
  }
};
