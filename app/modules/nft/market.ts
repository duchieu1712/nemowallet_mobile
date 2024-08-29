import { isArray, sortBy } from "lodash";
import { cast, getColorForItem } from "../../common/utilities";
import {
  type Metadata,
  type MetadataAttribute,
} from "../graphql/types/generated";

const __GS_ITEM_ATTRS__ = [
  "Health",
  "Mana",
  "Attack",
  "Defence",
  "Accuracy",
  "Evasion",
  "Critical",
  "Critical Resistance",
  "Fatal",
  "Block",
  "Defence Penetration",
  "True Damage",
  "Lifesteal",
  "Critical Damage",
  "Fatal Damage",
  "Damage Increase",
  "Increased Health",
  "Increased Damage",
  "Increased Defence",
  "Increased Accuracy",
  "Increased Evasion",
  "Increased Critical",
  "Increased Critical Resitance",
  "Increased Fatal",
  "Increased Block",
  "Increased Defence Penetration",
  "Stun Resistance",
  "Silent Resitance",
  "Root Resistance",
  "Burn Resistance",
  "Slow Resistance",
];

const __BS_ITEM_ATTRS__PET = [
  "Flexible_Final",
  "Dexterity_Final",
  "Strength_Final",
  "Physical_Final",
  "Flexible_Basic",
  "Dexterity_Basic",
  "Strength_Basic",
  "Physical_Basic",
];

const __GENERAL_ITEM_ATTRS__PET = [
  "Mature",
  "Star_Level",
  "Enlightening_Level",
  "Cultivating_Level",
];

const __PSSKILL_ITEM_ATTRS__PET = [
  "PassiveSkillName_0",
  "PassiveSkillLevel_0",
  "PassiveSkillName_1",
  "PassiveSkillLevel_1",
  "PassiveSkillName_2",
  "PassiveSkillLevel_2",
  "PassiveSkillName_3",
  "PassiveSkillLevel_3",
  "PassiveSkillName_4",
  "PassiveSkillLevel_4",
  "PassiveSkillName_5",
  "PassiveSkillLevel_5",
  "PassiveSkillName_6",
  "PassiveSkillLevel_6",
  "PassiveSkillName_7",
  "PassiveSkillLevel_7",
];

const __ACSKILL_ITEM_ATTRS__PET = ["ActiveSkillName", "ActiveSkillLevel"];

const __ACSKILL_ITEM_ATTRS__HEQ = ["SkillName", "SkillLevel"];

export class DmetadataAttribute {
  id: number;
  display_type: string;
  trait_type: string;
  value: string;
  color?: number;
  toHuman = (k: any | unknown): any => {
    if (this[k] == undefined) return;
    if (k == "value") {
      let ret = "";
      switch (this.display_type) {
        case "number":
        case "boost_number": {
          ret = `+${this.value}`;
          break;
        }
        case "percentage":
        case "boost_percentage": {
          ret = `+${this.value} %`;
          break;
        }
        default: {
          ret = `+${this.value}`;
        }
      }
      return ret;
    }
    return this[k];
  };

  static fromObject = (o: MetadataAttribute): DmetadataAttribute => {
    const ret = new DmetadataAttribute();
    const p = o?.id?.split("-");
    if (p && p.length != 0) {
      ret.id = parseInt(p[1]);
    }
    if (o.display_type != undefined) {
      ret.display_type = o.display_type;
    }
    if (o.trait_type != undefined) {
      ret.trait_type = o.trait_type;
    }
    if (o.value != undefined) {
      ret.value = o.value;
    }
    return ret;
  };
}

export const DmetadataAttributeInital = cast<DmetadataAttribute>({
  display_type: "string",
  trait_type: null,
  value: null,
  color: null,
});

export class Dmetadata {
  sect: DmetadataAttribute = cast<DmetadataAttribute>({
    display_type: "string",
    trait_type: "sect",
    value: "None",
  });

  quality: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  type: DmetadataAttribute = cast<DmetadataAttribute>(DmetadataAttributeInital);
  grade: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  level: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  power: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  description: string;
  name: string;
  image: string;
  basicAttributes: DmetadataAttribute[] = [];
  purifiedAttributes: DmetadataAttribute[] = [];

  // Pet
  generalAttributesPet: DmetadataAttribute[] = [];
  basicAttributesPet = [];
  activeSkills = [];
  passiveSkills = [];
  skillHEQ = [];

  /* Start Galix */
  // Basic Stat
  star: DmetadataAttribute = cast<DmetadataAttribute>(DmetadataAttributeInital);
  morale: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  physique: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  support: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  develop: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  troops: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  cardlevel: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  // Card Info
  battlepoint: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  atk: DmetadataAttribute = cast<DmetadataAttribute>(DmetadataAttributeInital);
  hp: DmetadataAttribute = cast<DmetadataAttribute>(DmetadataAttributeInital);
  units: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  speed: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  range: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  ability: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  //
  rarity: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  // Land
  devpoint: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  locationx: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  locationy: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  landid: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  // PVESkills = []
  // passiveSkills = []
  PVPSkills = [];

  skills = [];

  /* End Galix */

  /* Start Flashpoint */
  nfttype: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  penetration: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  ammo: DmetadataAttribute = cast<DmetadataAttribute>(DmetadataAttributeInital);
  damage: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  precision: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  stability: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  reload: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  portability: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  /* End Flashpoint */

  /* Start Mecha - N81 */

  criticalratio: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  rescriticalratio: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  criticaldamage: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  attack: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  curecriticalratio: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  defense: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  abnormalattrratio: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  resabnormalratio: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  awake: DmetadataAttribute = cast<DmetadataAttribute>(
    DmetadataAttributeInital,
  );

  /* End Mecha */

  static fromObject = (o: Metadata): Dmetadata => {
    const ret: Dmetadata = new Dmetadata();
    const ats = o.attributes;
    const keys = Object.keys(ret);
    const pa = []; // ret.purifiedAttributes temp
    const ba = []; // ret.basicAttributes temp
    //
    const genPet = [];
    const bsPet = [];
    const actPet = [];
    const passPet = [];
    const skillHeq = [];
    //

    const pVPSkill = [];
    const pveskill = [];
    // const passiveskill = [];
    const pskills = [];

    let attrPurifiedStyle;
    for (let i = 0; i < ats.length; i++) {
      let k = ats[i].trait_type;
      if (k == "PurifiedStyle") {
        attrPurifiedStyle = ats[i].value;
      }
      if (__GS_ITEM_ATTRS__.includes(k)) {
        if (ats[i]?.display_type?.includes("boost_")) {
          pa.push(DmetadataAttribute.fromObject(ats[i]));
          continue;
        }
        ba.push(DmetadataAttribute.fromObject(ats[i]));
        continue;
      }
      // Pet
      // general attributes
      if (__GENERAL_ITEM_ATTRS__PET.includes(k)) {
        genPet.push(DmetadataAttribute.fromObject(ats[i]));
        continue;
      }
      // Pass Skill
      if (__PSSKILL_ITEM_ATTRS__PET.includes(k)) {
        const mPassPet = passPet.find((e) => k.includes(e.type));
        if (mPassPet == null) {
          const newPS = {};
          const splitK = k?.split("_");
          newPS.type = splitK && splitK.length >= 2 ? splitK[1] : "";
          newPS.id = ats[i].id;
          if (k.includes("PassiveSkillName")) {
            newPS.title = DmetadataAttribute.fromObject(ats[i]);
          } else {
            newPS.value = DmetadataAttribute.fromObject(ats[i]);
          }
          passPet.push(newPS);
        } else {
          if (k.includes("PassiveSkillName")) {
            mPassPet.title = DmetadataAttribute.fromObject(ats[i]);
          } else {
            mPassPet.value = DmetadataAttribute.fromObject(ats[i]);
          }
        }
        continue;
      }
      // Active Skill
      if (__ACSKILL_ITEM_ATTRS__PET.includes(k)) {
        // find object
        const mActivePet = actPet.find((e) => k.includes(e.type));
        if (mActivePet == null) {
          const newAS = {};
          const splitK = k?.split("_");
          newAS.type = splitK && splitK.length >= 2 ? splitK[1] : "";
          newAS.id = ats[i].id;
          if (k.includes("ActiveSkillName")) {
            newAS.title = DmetadataAttribute.fromObject(ats[i]);
          } else {
            newAS.value = DmetadataAttribute.fromObject(ats[i]);
          }
          actPet.push(newAS);
        } else {
          if (k.includes("ActiveSkillName")) {
            mActivePet.title = DmetadataAttribute.fromObject(ats[i]);
          } else {
            mActivePet.value = DmetadataAttribute.fromObject(ats[i]);
          }
        }
        continue;
      }
      // Basic atrributes
      if (__BS_ITEM_ATTRS__PET.includes(k)) {
        // find object
        const mBsPet = bsPet.find((e) => k.includes(e.type));
        if (mBsPet == null) {
          const newBS = {};
          const splitK = k?.split("_");
          newBS.type = splitK && splitK.length >= 1 ? splitK[0] : "";
          newBS.id = ats[i].id;
          if (k.includes("_Basic")) {
            newBS.basic = DmetadataAttribute.fromObject(ats[i]);
          } else {
            newBS.final = DmetadataAttribute.fromObject(ats[i]);
          }
          bsPet.push(newBS);
        } else {
          if (k.includes("_Basic")) {
            mBsPet.basic = DmetadataAttribute.fromObject(ats[i]);
          } else {
            mBsPet.final = DmetadataAttribute.fromObject(ats[i]);
          }
        }
        continue;
      }

      // Skill HEQ
      if (__ACSKILL_ITEM_ATTRS__HEQ.includes(k)) {
        // find object
        const mskillHeq = skillHeq.find((e) => k.includes(e.type));
        if (mskillHeq == null) {
          const newAS = {};
          const splitK = k?.split("_");
          newAS.type = splitK && splitK.length >= 2 ? splitK[1] : "";
          newAS.id = ats[i].id;
          if (k.includes("SkillName")) {
            newAS.title = DmetadataAttribute.fromObject(ats[i]);
          } else {
            newAS.value = DmetadataAttribute.fromObject(ats[i]);
          }
          skillHeq.push(newAS);
        } else {
          if (k.includes("SkillName")) {
            mskillHeq.title = DmetadataAttribute.fromObject(ats[i]);
          } else {
            mskillHeq.value = DmetadataAttribute.fromObject(ats[i]);
          }
        }
        continue;
      }

      k = k?.toLowerCase();
      if (k == "career") k = "grade";

      // PassiveSkill
      // if (k == "passiveskill") {
      //   let lstSkill = [];
      //   try {
      //     lstSkill = JSON.parse(ats[i].value);
      //   } catch {
      //     lstSkill = [];
      //   }
      //   if (!isArray(lstSkill)) continue;
      //   for (let j = 0; j < lstSkill.length; j++) {
      //     const newPS = {};
      //     newPS["title"] = lstSkill[j].name;
      //     newPS["value"] = lstSkill[j].level;
      //     passiveskill.push(newPS);
      //   }
      // }
      // PVESkill
      if (k == "pveskill") {
        // find object
        let lstSkill = [];
        try {
          lstSkill = JSON.parse(ats[i].value);
        } catch {
          lstSkill = [];
        }
        if (!isArray(lstSkill)) continue;
        for (let j = 0; j < lstSkill.length; j++) {
          const mActivePet = {};
          mActivePet.title = lstSkill[j].name;
          mActivePet.value = lstSkill[j].level;
          pveskill.push(mActivePet);
        }
      }
      // PVPSkill
      if (k == "pvpskill") {
        // find object
        let lstSkill = [];
        try {
          lstSkill = JSON.parse(ats[i].value);
        } catch {
          lstSkill = [];
        }
        if (!isArray(lstSkill)) continue;
        for (let j = 0; j < lstSkill.length; j++) {
          const PVPSkill = {};
          PVPSkill.title = lstSkill[j].name;
          PVPSkill.value = lstSkill[j].level;
          pVPSkill.push(PVPSkill);
        }
      }
      // PVPSkill
      if (k == "skills") {
        // find object
        let lstSkill = [];
        try {
          lstSkill = JSON.parse(ats[i].value);
        } catch {
          lstSkill = [];
        }
        if (!isArray(lstSkill)) continue;
        for (let j = 0; j < lstSkill.length; j++) {
          const PVPSkill = {};
          PVPSkill.title = lstSkill[j].name;
          PVPSkill.value = lstSkill[j].value;
          PVPSkill.level = lstSkill[j].level;
          pskills.push(PVPSkill);
        }
      }

      if (keys.includes(k)) {
        ret[k] = DmetadataAttribute.fromObject(ats[i]);
        continue;
      }
    }
    // set color for AttrPurified
    if (attrPurifiedStyle != null) {
      const splitPurified = attrPurifiedStyle.split(",");
      for (let j = 0; j < splitPurified.length; j++) {
        if (splitPurified[j] != "") {
          const splitAtrr = splitPurified[j].split(":");
          if (splitAtrr.length == 2) {
            const index = pa.findIndex((e) => e.trait_type == splitAtrr[0]);
            if (index >= 0) {
              pa[index].color = getColorForItem(splitAtrr[1].trim());
            }
          }
        }
      }
    }
    //
    ret.basicAttributes = sortBy(ba, ["id"], ["asc"]);
    ret.purifiedAttributes = sortBy(pa, ["id"], ["asc"]);
    // Pet
    ret.basicAttributesPet = sortBy(bsPet, ["id"], ["asc"]);
    ret.generalAttributesPet = sortBy(genPet, ["id"], ["asc"]);
    ret.passiveSkills = sortBy(passPet, ["id"], ["asc"]);
    ret.activeSkills = sortBy(actPet, ["id"], ["asc"]);
    ret.skillHEQ = sortBy(skillHeq, ["id"], ["asc"]);

    //
    // ret.passiveSkills = sortBy(passiveskill, ["id"], ["asc"]);
    // ret.PVESkills = sortBy(pveskill, ['id'], ['asc'])
    ret.PVPSkills = sortBy(pVPSkill, ["id"], ["asc"]);
    ret.skills = sortBy(pskills, ["id"], ["asc"]);

    ret.description = o?.description
      ?.replaceAll(/\[[0-9a-z-]*\]/gi, " ")
      ?.replace("  ", " ")
      ?.replaceAll(`'n`, `\\n`);
    ret.name = o.name;
    ret.image = o.image;
    return ret;
  };
}
