import { TOP_SERVICE_VOTE } from "../common/enum";

export const cf_homepage = {
  //
  BannerAdvertisment: {
    image: "Staking_COGI.png",
    small_image: "Staking_COGI_small.png",
    isLinkDownload: false,
    linkIOS: "https://soulrealm.nemoverse.io/ios",
    linkAndroid: "https://play.google.com/store/apps/details?id=com.soul.realm",
    linkPC: "https://soulrealm.nemoverse.io/en/home",
    textButton: "",
    linkPlayNow: "https://soulrealm.nemoverse.io/en/home",
    description: "Staking COGI on COGIChain",
  },
  //
  topSerivce: {
    imageBanner: "N36-big.png",
    linkDownloadWindow: "",
    linkDownLoadIOS: "",
    linkCHPlay: "",
    description:
      " For a limited time, recruit and summon your Champions to battle in the arena! Available to download for both PC and Android.",
    linkPlayNow: "",
  },
  listTopService: [
    {
      index: 0,
      image: "Soul Realm.png",
      nameService: "Soul Realm",
      desciptionService: "Soul Realm Official Version",
      service: {
        textButton: "Play Now",
        image_small: "Soul Realm.png",
        imageBanner: "Soul Realm Release.png",
        isLinkDownload: false,
        linkDownloadWindow: "",
        linkDownLoadIOS: "",
        linkCHPlay: "",
        description: `The moment everyone has been waiting for has finally arrived! Right now, let's quickly open the gate and start to fight in the world of Soul Realm, Heroes!!!`,
        linkPlayNow: "https://soulrealm.nemoverse.io/en/home",
      },
    },
    {
      index: 1,
      image: "One Market.png",
      nameService: "One Market",
      desciptionService: "ONE Marketplace release!",
      service: {
        textButton: "Trade Now",
        image_small: "One Market.png",
        imageBanner: "One Market.png",
        isLinkDownload: false,
        linkDownloadWindow: "",
        linkDownLoadIOS: "",
        linkCHPlay: "",
        description:
          "One Marketplace has officially launched since December 19, 2022 and is a common trading place for all services in COGI Network.",
        linkPlayNow: "/marketplace",
      },
    },
    {
      index: 2,
      image: "9DNFT.png",
      nameService: "9DNFT",
      desciptionService: "9DNFT Birthday",
      service: {
        textButton: "Play Now",
        image_small: "9DNFT.png",
        imageBanner: "9DNFT Birthday.png",
        isLinkDownload: false,
        linkDownloadWindow: "",
        linkDownLoadIOS: "",
        linkCHPlay: "",
        description: `9DNFT - 1 year - 1 journey! It's precious that we always have each other and go through so many innovations together.`,
        linkPlayNow: "https://9dnft.com/",
      },
    },
    {
      index: 3,
      image: "GaliXCity.png",
      nameService: "GaliXCity",
      desciptionService: "GaliXCity move to COGIChain",
      service: {
        textButton: "Coming soon",
        image_small: "GaliXCity.png",
        imageBanner: "GaliXCity move to COGIChain 1.png",
        isLinkDownload: false,
        linkDownloadWindow: "",
        linkDownLoadIOS: "",
        linkCHPlay: "",
        description:
          "GaliXCity move to COGI Chain & support by NEMO Platform, NEMO Wallet, ONE Marketplace.",
        linkPlayNow: "https://galixcity.io/",
      },
    },
    {
      index: 4,
      image: "Logo COGI.png",
      nameService: "COGI",
      desciptionService: "Staking COGI - Round 1",
      service: {
        textButton: "Read more",
        image_small: "Logo COGI.png",
        imageBanner: "Staking COGI 1.png",
        isLinkDownload: false,
        linkDownloadWindow: "",
        linkDownLoadIOS: "",
        linkCHPlay: "",
        description:
          "POOL STAKING is coming to COGI NETWORK in JANUARY 2023! Are you ready to experience?",
        linkPlayNow: "/news/staking_cogi_on_cogichain_intructions/",
      },
    },
    {
      index: 5,
      image: "FlashPoint.png",
      nameService: "FlashPoint",
      desciptionService: "The first FPS game on COGIChain",
      service: {
        textButton: "Coming soon",
        image_small: "FlashPoint.png",
        imageBanner: "FlashPoint move to COGIChain 1.png",
        isLinkDownload: false,
        linkDownloadWindow: "",
        linkDownLoadIOS: "",
        linkCHPlay: "",
        description:
          "Gunfight to win NEMO. Win or lose depends on your shooting skills. Join us to become a great sniper and get rich with your skills!",
        linkPlayNow: "",
      },
    },
  ],
  COGI_Vision: {
    Introduction: "/COGI_Introduction.pdf",
  },
  OurService: {
    marketplace: {
      description:
        "ONE Marketplace: A centralized Marketplace for all services and all products in the ecosystem. ",
      linkDirect: "/marketplace",
    },
    wallet: {
      description:
        "NEMO Wallet: To use Blockchain services, an E-Wallet is a prerequisite that every user needs.",
      linkDirect: "/NEMOWallet",
    },
    platform: {
      description:
        "NEMO Platform: A management and operation platform that automates the decentralized digital economy model. ",
      linkDirect: "/COGI_Introduction.pdf",
    },
    launchpad: {
      description:
        "COGI Launchpad: INO, IGO Pools, Launch Pools – Launchpads for new projects in COGI Chain which help attract more projects and developers to COGI Chain.",
      linkDirect: "",
    },
    dex: {
      description:
        "COGI Dex: A DEX that is used to trade tokens in the COGI Ecosystem, operating on COGI Chain with smart contracts and peer-to-peer networks. Friendly interface, easy to understand, low transaction fees, fast transaction speed.",
      linkDirect: "",
    },
    bridge: {
      description:
        "COGI Bridge: A bridge that assists with token transfers between networks and attracts money flows from external networks into COGI Chain.",
      linkDirect: "/NEMOWallet",
    },
  },
  TopService: {
    services: [
      {
        index: 0,
        name: "Soul Realm",
        image: "Top1_N36_Soul Realm",
        vote: TOP_SERVICE_VOTE.TOP_1, // ENUM Vote
        imageBanner: "Top1_N36_Soul Realm_Art",
        description: `Soul Land was once a glorious land located in the centre of all realms. However, ever since the missing of Soul Land's Sovereign, it fell into a period of turmoils due to chaos of wars. After an unexpected event, demons from The Demon World flooded into the Soul Land with the aim to invade this sacred land. The Great Good-Evil World War is about to break out. Who will be the hero to drive away the enemy?`,
        linkViewMore: "https://soulrealm.nemoverse.io/",
      },
      {
        index: 1,
        name: "9DNFT",
        image: "Top2_N70-Banner",
        vote: TOP_SERVICE_VOTE.TOP_2, // ENUM Vote
        imageBanner: "Top2_N70-Art",
        description: `The First 3D Martial Art/Metaverse NFT Game in SEA. Immerse yourself in the vast 3D World and martial art experience with many unique features such as: Chinese five elements system, unbound items grinding, and more! `,
        linkViewMore: "https://9dnft.com/",
      },
      {
        index: 2,
        name: "GaliXCity",
        image: "Top3_N69-Banner",
        vote: TOP_SERVICE_VOTE.TOP_3, // ENUM Vote
        imageBanner: "Top3_N69-Art",
        description: `GaliX Universe 2112 - A world on the verge of destruction with endless wars and violence reigns. It calls for you - the Chosen One - to build your city, recruit talents and leave your name in the Hall of Fame, while earning remarkable values with the help of NFT technology along the way. 
        To be the Savior or the sole Ruler of GaliX Universe? The choice is yours!`,
        linkViewMore: "https://galixcity.io/",
      },
      {
        index: 3,
        name: "Mecha Warfare",
        image: "Top4_N81-Banner",
        vote: TOP_SERVICE_VOTE.TOP_4, // ENUM Vote
        imageBanner: "Top4_N81-Art",
        description: `In the world of Mecha Warfare, mankind has been evolving and striving hard for economic recovery after World War II. With their advanced tech, they have gradually attained the capacity to travel and live on Colonies (artificial asteroids). However, just as they felt leaving Earth was a harmless decision, Valeons, exotic species occupied in nearby asteroids have unexpectedly risen from their hibernation. How could mankind battle these strange beings? Let's wait and see their answers!`,
        linkViewMore: "https://mecha.nemoverse.io/",
      },
      {
        index: 4,
        name: "FlashPoint",
        image: "Top5_N00-Banner",
        vote: TOP_SERVICE_VOTE.TOP_5, // ENUM Vote
        imageBanner: "Top5_N00-Art",
        description: `FLASHPOINT - The First FPS Game On COGI-CHAIN is a real-time first-person shooter game that will keep you on the edge of your seat. You’ll be able to choose from a variety of weapons and guns to take down your enemies. You can play solo or team up with friends to take on other teams. 
        One of FlashPoint's coolest features is the NEMO Challenge room, where you can use your NEMO to participate, battle, and win other players' NEMOs. So, to become rich, join the GUN FIGHT TO WIN NEMO`,
        linkViewMore: "",
      },
      {
        index: 5,
        name: "Heaven Sword",
        image: "Top6_N52-Banner",
        vote: TOP_SERVICE_VOTE.TOP_6, // ENUM Vote
        imageBanner: "Top6_N52-Art",
        description: "Coming soon 2023…",
        linkViewMore: "",
      },
      {
        index: 6,
        name: "Road Mobile",
        image: "Top7_N29-Banner",
        vote: TOP_SERVICE_VOTE.TOP_7, // ENUM Vote
        imageBanner: "Top7_N29-Art",
        description: "Coming soon 2023…",
        linkViewMore: "",
      },
      {
        index: 7,
        name: "Call of Empires",
        image: "Top8_N71-Banner",
        vote: TOP_SERVICE_VOTE.TOP_8, // ENUM Vote
        imageBanner: "Top8_N71-Art",
        description: "Coming soon 2023…",
        linkViewMore: "",
      },
      {
        index: 8,
        name: "Final Wushu",
        image: "Top9_N92-Banner",
        vote: TOP_SERVICE_VOTE.TOP_9, // ENUM Vote
        imageBanner: "Top9_N92-Art",
        description: "Coming soon 2023…",
        linkViewMore: "",
      },
    ],
  },
  Roadmap: {
    time: [
      {
        index: 0,
        name: "Q1.2021",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "Planning for 9DNFT gameplay::Marketplace Development::Research NFT Game and Tokenomics::Developing NFT item as ERC721 standard",
      },
      {
        index: 1,
        name: "Q2.2021",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "Developing NFT ITEM as ERC721 standard::Developing 9D Wallet::Designing Play to Earn mechanism in 9DNFT",
      },
      {
        index: 2,
        name: "Q3.2021",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "Building COGI token & COD token based on the BSC Chain::Developing 9DNFT Marketplace (Smart contract, dApps)::Building major features for NFT marketplace",
      },
      {
        index: 3,
        name: "Q4.2021",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "INO, IDO 9DNFT::Launching 9DNFT- The first 3D Martial Art/ Metaverse NFT Game in SEA::Launching 9DNFT Marketplace",
      },
      {
        index: 4,
        name: "Q1.2022",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "Staking COGI::Update gameplay content::Event Lottery blockchain",
      },
      {
        index: 5,
        name: "Q2.2022",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "Big Update gameplay content: New PVE features, new Event, new Map, new Character…::New feature: Guild War::Updating and improving 9DNFT Marketplace, 9DWallet",
      },
      {
        index: 6,
        name: "Q3.2022",
        timeStart: 1656633600000,
        timeEnd: 1664582400000,
        description:
          "Building COGI cross chain platform for gaming industry to connect with major ecosystem Layer1::9DNFT Big update V1.3::PVP Tournament - Beta version",
      },
      {
        index: 7,
        name: "Q4.2022",
        timeStart: 1664582400000,
        timeEnd: 1669939199000,
        description:
          "Launching COGI Chain & NEMO Platform::M&A AIVO Venture F.Z.C::Launching COGI Scan, COGI Bridge::9DNFT Big update V2.0",
      },
      {
        index: 8,
        name: "Q4-Dec.2022",
        timeStart: 1669852800000,
        timeEnd: 1672531199000,
        description:
          "Launching Soul Realm (the 2nd game on NEMO Platform)::Launching NEMO wallet web version::Launching One SDK, One Marketplace::M&A Skymatic & launching Skymatic.NEMOverse.io",
      },
      {
        index: 9,
        name: "Jan.2023",
        timeStart: 1672531200000,
        timeEnd: 1675209599000,
        description:
          "Staking COGI on COGI Chain::Migrate GalixCity game to COGI chain (Game 3rd)::Updating and improving ONE Marketplace, NEMO Wallet",
      },
      {
        index: 10,
        name: "Feb-Mar.2023",
        timeStart: 1675209600000,
        timeEnd: 1680307199000,
        description:
          "COGIDomain- Decentralize Naming Service::Launching COGI Dex (MaticSwap)::Big update all game PWE::Launching Project 4th on NEMO Platform",
      },
      {
        index: 11,
        name: "Q2.2023",
        timeStart: 1680307200000,
        timeEnd: 1688255999000,
        description:
          "NEMO Wallet + ONE Marketplace on Mobile app version::COGI LaunchPad mainnet::Launching Project 5th on NEMO Platform::Improving and upgrading MaticSwap::Big update all game PWE",
      },
      {
        index: 12,
        name: "Q3.2023",
        timeStart: 1688169600000,
        timeEnd: 1696118399000,
        description:
          "Improving quality and security for COGi Chain::Adding functionalities for ONE Marketplace::Big update all game PWE::Launching Project 6th on NEMO Platform",
      },
      {
        index: 13,
        name: "Q4.2023",
        timeStart: 1696118400000,
        timeEnd: 1704067199000,
        description:
          "Launching public COGI Chain - Layer 2 for executes EVM smart contracts, creates assets::Big update all game PWE::Launching Project 7th on NEMO Platform",
      },
    ],
  },
  Partner: [
    {
      id: 1,
      name: "Gihot",
      image: "gihot.png",
    },
    {
      id: 2,
      name: "GOSU",
      image: "gosu.png",
    },
    {
      id: 3,
      name: "Token Suite",
      image: "token suite.png",
    },
    {
      id: 4,
      name: "GAME6",
      image: "game6.png",
    },
    {
      id: 5,
      name: "coincu",
      image: "coincu.png",
    },
    {
      id: 6,
      name: "GAMEAZ",
      image: "gameaz.png",
    },
    {
      id: 7,
      name: "ONEBIT",
      image: "onebit.png",
    },
    {
      id: 8,
      name: "GAMONI",
      image: "gamoni.png",
    },
    {
      id: 9,
      name: "AIKO",
      image: "aiko.png",
    },
    {
      id: 10,
      name: "PHOENIX",
      image: "phoenix.png",
    },
    {
      id: 11,
      name: "SKH",
      image: "skh.png",
    },
    {
      id: 12,
      name: "MAXIMIZING THE POTENTIAL",
      image: "maxx.png",
    },
    {
      id: 13,
      name: "ONUS",
      image: "onuso.png",
    },
    {
      id: 14,
      name: "VECOM",
      image: "vecom.png",
    },
    // {
    //   id: 15,
    //   name: 'SOLID Proof',
    //   image: 'solidproof.png',
    // },
  ],
};
