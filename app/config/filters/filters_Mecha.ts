export const cf_LST_FILTER_LEVEL_MECHA = [
  {
    name: "1",
    grade: 1,
  },
  {
    name: "200",
    grade: 200,
  },
];

export const cf_LST_FILTER_STAR_MECHA = [
  {
    name: "1",
    grade: 1,
  },
  {
    name: "5",
    grade: 5,
  },
];

export const cf_LST_TYPES_MECHA = [
  {
    type: "Hero",
    lstFilter: [
      {
        // categories: 'Strength',
        categories: "Tanker",
        metadataType: "Tanker",
      },
      {
        // categories: 'Agility',
        categories: "Healer",
        metadataType: "Healer",
      },
      {
        // categories: 'Stamina',
        categories: "Supporter",
        metadataType: "Supporter",
      },
      {
        // categories: 'Intelligence',
        categories: "Attacker",
        metadataType: "Attacker",
      },
    ],
  },
  {
    type: "Equipment",
    lstFilter: [
      {
        categories: "Necklace",
        metadataType: "Necklace",
      },
      {
        categories: "Clothes",
        metadataType: "Clothes",
      },
      {
        categories: "Ring",
        metadataType: "Ring",
      },
      {
        categories: "Belt",
        metadataType: "Belt",
      },
      {
        categories: "Shoes",
        metadataType: "Shoes",
      },
      {
        categories: "Weapon",
        metadataType: "Weapon",
      },
    ],
  },
  {
    type: "Common",
    lstFilter: [
      {
        categories: "Mystic Medal",
        metadataType: "Mystic Medal",
      },
    ],
  },
];

export const cf_LST_RARITY_MECHA_WARFARE = [
  {
    categories: "common",
    metadataRarity: "N",
    value: [1],
  },
  {
    categories: "rare",
    metadataRarity: "R",
    value: [2],
  },
  {
    categories: "elite",
    metadataRarity: "SR",
    value: [3],
  },
  {
    categories: "ascension",
    metadataRarity: "SSR",
    value: [4],
  },
  {
    categories: "legendary",
    metadataRarity: "UR",
    value: [5],
  },
];
