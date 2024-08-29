import {
  FILTER_NFT_TYPE_FLASHPOINT_MARKET,
  FILTER_NFT_TYPE_GALIX_MARKET,
  SERVICE_ID,
  _9D_MYSTERYBOX,
} from "../../common/enum";
import cf_rewards_mysterybox_9dnft from "../../config/mysterybox/9dnft/reward_mysterybox_9dnft";
import cf_rewards_mysterybox_flashpoint from "../../config/mysterybox/flashpoint/reward_mysterybox_flashpoint";
import cf_rewards_mysterybox from "../../config/mysterybox/galix/reward_mysterybox_galix";
import cf_rewards_mysterybox_mecha from "../../config/mysterybox/mecha_warfare/reward_mysterybox_mecha";

export const powerOrStar = [
  {
    serviceID: SERVICE_ID._9DNFT,
    field: {
      key: "power",
      name: "Power",
      valueType: "text",
    },
  },
  {
    serviceID: SERVICE_ID._GALIXCITY,
    field: {
      key: "star",
      name: "Star",
      valueType: "icon",
    },
  },
  {
    serviceID: SERVICE_ID._RICHWORK_FARM_FAMILY,
    field: {
      key: "star",
      name: "Star",
      valueType: "icon",
    },
  },
  {
    serviceID: SERVICE_ID._MARSWAR,
    field: {
      key: "star",
      name: "Star",
      valueType: "icon",
    },
  },
  {
    serviceID: SERVICE_ID._SOUL_REALM,
    field: {
      key: "power",
      name: "Power",
      valueType: "text",
    },
  },
];

export const qualityNFTbyColorText = [
  SERVICE_ID._9DNFT,
  SERVICE_ID._SOUL_REALM,
];

export const TypeNFTNotSameHeroGalix = [FILTER_NFT_TYPE_GALIX_MARKET.LAND];

export const generalInfo = [
  {
    serviceID: SERVICE_ID._9DNFT,
    fields: [
      {
        key: "sect",
        title: "Sect",
      },
      {
        key: "type",
        title: "Type",
      },
      {
        key: "grade",
        title: "Grade",
      },
      {
        key: "level",
        title: "Level",
      },
      {
        key: "power",
        title: "Power",
      },
    ],
  },
  {
    serviceID: SERVICE_ID._SOUL_REALM,
    fields: [
      {
        key: "sect",
        title: "Sect",
      },
      {
        key: "type",
        title: "Type",
      },
      {
        key: "grade",
        title: "Grade",
      },
      {
        key: "level",
        title: "Level",
      },
      {
        key: "power",
        title: "Power",
      },
    ],
  },
  {
    serviceID: SERVICE_ID._GALIXCITY,
    fields: [
      {
        key: "type",
        title: "Type",
      },
      {
        key: "rarity",
        title: "Rarerity",
      },
      {
        key: "star",
        title: "Star",
        type: "icon",
        iconType: "star",
      },
      {
        key: "package",
        title: "Package",
      },
    ],
  },
  {
    serviceID: SERVICE_ID._MARSWAR,
    fields: [
      {
        key: "type",
        title: "Type",
      },
      {
        key: "rarity",
        title: "Rarerity",
      },
      {
        key: "star",
        title: "Star",
      },
    ],
  },
  {
    serviceID: SERVICE_ID._FLASHPOINT,
    fields: [
      {
        key: "type",
        title: "Type",
      },
    ],
  },
  {
    serviceID: SERVICE_ID._RICHWORK_FARM_FAMILY,
    fields: [
      {
        key: "type",
        title: "Type",
      },
    ],
  },
];

export const attributes_info = [
  {
    serviceID: SERVICE_ID._9DNFT,
    isType: SERVICE_ID._9DNFT,
    fields: [
      {
        title: "Basic attribute",
        keys: [
          {
            name: "",
            key: "basicAttributes",
            checkColorForField: false,
            checkToHuman: true,
          },
        ],
      },
      {
        title: "Purified attribute",
        keys: [
          {
            name: "",
            key: "purifiedAttributes",
            checkColorForField: false,
            checkToHuman: true,
          },
        ],
      },
      {
        title: "General Attribute",
        keys: [
          {
            name: "",
            key: "generalAttributesPet",
            checkColorForField: true,
            checkToHuman: false,
          },
        ],
      },
      {
        title: "Basic Attribute Pet",
        keys: [
          {
            name: "",
            key: "basicAttributesPet",
            checkColorForField: true,
            checkToHuman: true,
            isAttributePet: true,
          },
        ],
      },
      {
        title: "Skill",
        keys: [
          {
            name: "",
            key: "activeSkills",
            checkColorForField: true,
            isSkill: true,
          },
          {
            name: "",
            key: "passiveSkills",
            checkColorForField: true,
            isSkill: true,
          },
        ],
      },
      {
        title: "Skill HEQ",
        keys: [
          {
            name: "",
            key: "skillHEQ",
            checkColorForField: true,
            isSkill: true,
          },
        ],
      },
    ],
  },
  {
    serviceID: SERVICE_ID._SOUL_REALM,
    isType: SERVICE_ID._9DNFT,
    fields: [
      {
        title: "Basic attribute",
        keys: [
          {
            name: "",
            key: "basicAttributes",
            isSkill: false,
            checkToHuman: true,
          },
        ],
      },
      {
        title: "Purified attribute",
        keys: [
          {
            name: "",
            key: "purifiedAttributes",
            isSkill: false,
            checkToHuman: true,
          },
        ],
      },
      {
        title: "General Attribute",
        keys: [
          {
            name: "",
            key: "generalAttributesPet",
            isSkill: false,
            checkColorForField: true,
            checkToHuman: false,
          },
        ],
      },
      {
        title: "Basic Attribute Pet",
        keys: [
          {
            name: "",
            key: "basicAttributesPet",
            isSkill: false,
            checkToHuman: true,
            isAttributePet: true,
          },
        ],
      },
      {
        title: "Skill",
        keys: [
          {
            name: "",
            key: "activeSkills",
            isSkill: true,
            checkColorForField: true,
          },
          {
            name: "",
            key: "passiveSkills",
            isSkill: true,
            checkColorForField: true,
          },
          {
            name: "",
            key: "skillHEQ",
            isSkill: true,
            checkColorForField: true,
          },
        ],
      },
    ],
  },
  {
    serviceID: SERVICE_ID._GALIXCITY,
    isType: SERVICE_ID._GALIXCITY,
    list_of_type: [
      {
        type: FILTER_NFT_TYPE_GALIX_MARKET.HERO as string,
        fields: [
          {
            title: "Basic Stat",
            isSkill: false,
            keys: [
              {
                name: "Level",
                key: "level",
              },
              {
                name: "Morale",
                key: "morale",
              },
              {
                name: "Physique",
                key: "physique",
              },
              {
                name: "Power",
                key: "power",
              },
              {
                name: "Support",
                key: "support",
              },
              {
                name: "Growth",
                key: "growth",
              },
              {
                name: "Develop",
                key: "develop",
              },
              {
                name: "Troops",
                key: "troops",
              },
            ],
          },
          {
            title: "Card Info",
            isSkill: false,
            keys: [
              {
                name: "Rank",
                key: "cardlevel",
              },
              {
                name: "Attack Power",
                key: "atk",
              },
              {
                name: "Battle Point",
                key: "battlepoint",
              },
              {
                name: "Blood",
                key: "hp",
              },
              {
                name: "Number of troops",
                key: "units",
              },
              {
                name: "Attack range",
                key: "range",
              },
              {
                name: "Type",
                key: "metadataType",
              },
              {
                name: "Speed Attack",
                key: "speed",
              },
            ],
          },
          {
            title: "Campaign Skill",
            keys: [{ name: "", key: "ability" }],
            isSkill: false,
          },
          {
            title: "Passive Skills",
            keys: [{ name: "", key: "passiveSkills" }],
            isSkill: true,
          },
          {
            title: "PVPSkills",
            keys: [{ name: "", key: "PVPSkills" }],
            isSkill: true,
          },
        ],
      },
      {
        type: FILTER_NFT_TYPE_GALIX_MARKET.LAND as string,
        fields: [
          {
            title: "Basic Stat",
            keys: [
              {
                name: "Level",
                key: "level",
                key2: "level",
                twoKey: true,
              },
              {
                name: "Dev Point",
                key: "devpoints",
                key2: "devpoint",
                twoKey: true,
              },
              {
                name: "LocationX",
                key: "location_x",
                key2: "locationx",
                twoKey: true,
                isLocation: true,
              },
              {
                name: "LocationY",
                key: "location_y",
                key2: "locationy",
                twoKey: true,
                isLocation: true,
              },
              {
                name: "Reward Cumulative",
                key: "reward_cumulative",
                twoKey: false,
              },
              {
                name: "Reward Unclaimed",
                key: "reward_unclaimed",
                twoKey: false,
              },
              {
                name: "Resources Cumulative",
                key: "resource_cumulative",
                twoKey: false,
              },
              {
                name: "Reward Cumulative",
                key: "reward_cumulative",
                twoKey: false,
              },
              {
                name: "Resources Unclaimed",
                key: "resource_unclaimed",
                twoKey: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    serviceID: SERVICE_ID._MARSWAR,
    isType: SERVICE_ID._GALIXCITY,
    list_of_type: [
      {
        type: FILTER_NFT_TYPE_GALIX_MARKET.HERO as string,

        fields: [
          {
            title: "Basic Stat",
            isSkill: false,
            keys: [
              {
                name: "Level",
                key: "level",
              },
              {
                name: "Crit",
                key: "criticalratio",
              },
              {
                name: "Star",
                key: "star",
              },
              {
                name: "Crit Res",
                key: "rescriticalratio",
              },
              {
                name: "HP",
                key: "hp",
              },
              {
                name: "Crit DMG",
                key: "criticaldamage",
              },
              {
                name: "ATK",
                key: "attack",
              },
              {
                name: "Heal",
                key: "curecriticalratio",
              },
              {
                name: "Def",
                key: "defense",
              },
              {
                name: "DefBuff",
                key: "abnormalattrratio",
              },
              {
                name: "Spd",
                key: "speed",
              },
              {
                name: "Immune",
                key: "resabnormalratio",
              },
            ],
          },
          {
            title: "Hero Info",
            isSkill: false,
            keys: [
              {
                name: "Type",
                key: "metadataType",
              },
              {
                name: "Awaken",
                key: "awake",
              },
            ],
          },
          {
            title: "Skills",
            isSkill: true,
            keys: [
              {
                name: "",
                key: "skills",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    serviceID: SERVICE_ID._FLASHPOINT,
    isType: SERVICE_ID._GALIXCITY,
    list_of_type: [
      {
        type: FILTER_NFT_TYPE_FLASHPOINT_MARKET.WEAPON,
        fields: [
          {
            title: "Basic Stat",
            keys: [
              {
                name: "Penetration",
                key: "penetration",
              },
              {
                name: "AMMO",
                key: "ammo",
              },
              {
                name: "Damage",
                key: "damage",
              },
              {
                name: "Precision",
                key: "precision",
              },
              {
                name: "Stability",
                key: "stability",
              },
              {
                name: "Speed",
                key: "speed",
              },
              {
                name: "Reload",
                key: "reload",
              },
              {
                name: "Portability",
                key: "portability",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    serviceID: SERVICE_ID._RICHWORK_FARM_FAMILY,
    isType: SERVICE_ID._GALIXCITY,
    list_of_type: [
      {
        type: FILTER_NFT_TYPE_GALIX_MARKET.HERO,
        fields: [
          {
            title: "Basic Stat",
            isSkill: false,
            keys: [
              {
                name: "Level",
                key: "level",
              },
              {
                name: "Morale",
                key: "morale",
              },
              {
                name: "Physique",
                key: "physique",
              },
              {
                name: "Power",
                key: "power",
              },
              {
                name: "Support",
                key: "support",
              },
              {
                name: "Growth",
                key: "growth",
              },
              {
                name: "Develop",
                key: "develop",
              },
              {
                name: "Troops",
                key: "troops",
              },
            ],
          },
          {
            title: "Card Info",
            isSkill: false,
            keys: [
              {
                name: "Rank",
                key: "cardlevel",
              },
              {
                name: "Attack Power",
                key: "atk",
              },
              {
                name: "Battle Point",
                key: "battlepoint",
              },
              {
                name: "Blood",
                key: "hp",
              },
              {
                name: "Number of troops",
                key: "units",
              },
              {
                name: "Attack range",
                key: "range",
              },
              {
                name: "Type",
                key: "metadataType",
              },
              {
                name: "Speed Attack",
                key: "speed",
              },
            ],
          },
          {
            title: "Campaign Skill",
            keys: [{ name: "", key: "ability" }],
            isSkill: false,
          },
          {
            title: "Passive Skills",
            keys: [{ name: "", key: "passiveSkills" }],
            isSkill: true,
          },
          {
            title: "PVPSkills",
            keys: [{ name: "", key: "PVPSkills" }],
            isSkill: true,
          },
        ],
      },
    ],
  },
];

export const seriesContentRewards = [
  {
    serviceID: SERVICE_ID._9DNFT,
    rew: cf_rewards_mysterybox_9dnft,
    boxs: [_9D_MYSTERYBOX.DBOX, _9D_MYSTERYBOX.ABOX] as string[],
  },
  {
    serviceID: SERVICE_ID._GALIXCITY,
    rew: cf_rewards_mysterybox,
    boxs: ["gbox", "pbox", "dbox"],
  },
  {
    serviceID: SERVICE_ID._FLASHPOINT,
    rew: cf_rewards_mysterybox_flashpoint,
    boxs: ["babox", "gabox", "ppbox"],
  },
  {
    serviceID: SERVICE_ID._MARSWAR,
    rew: cf_rewards_mysterybox_mecha,
    boxs: ["n81mbox", "n81pbox", "n81sbox"],
  },
];
