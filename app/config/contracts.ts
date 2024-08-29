import {
  GalixERC20Abi,
  GalixBridgeAbi,
  GalixERC20HotWalletAbi,
  GalixERC721Abi,
  GalixERC721LandIfaceAbi,
  GalixERC721MarketAbi,
  KogiINOMarketAbi,
  OPSERC721Abi,
} from "../common/abi";
import { type IContract } from "../common/types";
import { SERVICE_ID } from "../common/enum";

// GALIX
const _preAvax = {
  GALIX_CONTRACT: "0xeccB13ab11989686d753941639DEdbFda82f0250",
  GALIX_HOTWALLET: "0x18200abf079C87e1c19d2607303554c1ae196DF2",
  NEMO_CONTRACT: "0x3cd4787C6930942F67FD700e128906cFA3077643",
  NEMO_HOTWALLET: "0x1cB7e17fE1965544850b01BF593FA44936683Ce4",
  USDT_CONTRACT: "0x08a978a0399465621e667c49cd54cc874dc064eb",
  COGI_CONTRACT: "0xf98ba93A9eeE2d532c54aEFb46d87466Ce8fD68C",
  V6GALIX_CONTRACT: "0x62105deddcb532d21fe45dd213989114c6f5faef",
  // NFT
};

const _avax = {
  GALIX_CONTRACT: "0xeccB13ab11989686d753941639DEdbFda82f0250",
  GALIX_HOTWALLET: "0x18200abf079C87e1c19d2607303554c1ae196DF2",
  NEMO_CONTRACT: "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f", // 1
  NEMO_HOTWALLET: "0x3bf2a37685B1F20961792FDFAFd29B3f94782269", // 1
  USDT_CONTRACT: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7", // 1
  COGI_CONTRACT: "0x6cB755C4B82e11e727C05f697c790FdBC4253957", // 1
  V6GALIX_CONTRACT: "0x62105deddcb532d21fe45dd213989114c6f5faef",
  // NFT
  _GALIXNFT_MARKET_CONTRACT: "0x114B21959D36c6f1e50CeDE9947CD27d3d8a0087", // 1
  _GALIXNFT_RES: "0x0Ca011BFce1E57D2CFFC12E06F9E82cd03025b8c", // 1
  _GALIXNFT_HRO: "0x68b55bd424A9411FF5e204107d9ADcCe7CDE4D51", // 1
  _GALIXNFT_LAND: "0xf4C4C571cb9D0890d9c3f996F7aE02790C532118", // 1
  _GALIXNFT_GBOX: "0xFa621354E35b93f3b183E248b783A76A610f399E", // 1
  _GALIXNFT_PBOX: "0x6488afc50e9d1F3608E85D533B60f9Ae1155093e", // 1
  _GALIXNFT_DBOX: "0x734B9a496FceDEcd8099cd946537c2Da0F8F63ce", // 1
  _GALIXNFT_INO: "0xcb6658394b9721Bc02Abfc313ef22ad0b416BFBD", // 1
  _TICKET_CONTRACT: "0xd2d3fA440A80e431D299Db71711d276a4127931d", // 1
  _RENTING_LAND: "0x6F5fc826f29362E7385Ad8749532301dDA0d7703",
  _GALIX_BRIDGE: "0x0f7599b3cfEb1Ce2bf4Dc8e20623e7Ec9F7C232F",
};

// 9DNFT

const _prebsc = {
  COGI_CONTRACT: "0x82f1ffCdB31433B63AA311295a69892EeBcdc2Bb",
  COGI_HOTWALLET: "0xB9F76B819747fb76ee03189f57A19b26534Fd483",
  COD_CONTRACT: "0xC46ad11d8b66134eCa03f707de050c053E664D93",
  COD_HOTWALLET: "0x1CC72947601CaEe0aD71974F4FDeD5AebAebC7a8",
  USDT_CONTRACT: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee", // 1
  NEMO_CONTRACT: "0xEb7e95513270F75c707ceD36B97bcFe7baCa10c6", // 1
  //
  BUSD_CONTRACT: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
  _GALIX_BRIDGE: "0x7e701A98D9408c5609D0a409723A313D3739f721",
};

const _bsc = {
  COGI_CONTRACT: "0x6cB755C4B82e11e727C05f697c790FdBC4253957",
  COGI_HOTWALLET: "0xaF84ea652192d9B41c3a233aeb0d37e883143A81",
  COD_CONTRACT: "0x8D8800687afeA249451734Af243A8983c8C2a9E5",
  COD_HOTWALLET: "0x61Cd50F08A2c1cAac0049f6A8f0740A524d525E5",
  USDT_CONTRACT: "0x55d398326f99059ff775485246999027b3197955", // 1
  NEMO_CONTRACT: "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f", // 1

  _9DNFT_HRO: "0x7e4A38c184385aC0350Fd8C79665344F4c3c23e7",
  _9DNFT_PET: "0x1fAd723De3084eAA3dD753c8fEA81cc6a1805E1D",
  _9DNFT_PETN: "0xb56c55eeeEeFB95F84b08e401d58929B3c1fc9D2",
  _9DNFT_MNT: "0x2cD6D67409895fd395Bb4e9D5415DC4bF0Faa65C",
  _9DNFT_BOX: "0x03F462ceaD9eaccbD4afE8d30516EFfb6152Df09",
  _9DNFT_AEQ: "0x05960ADB9617428802B38D254Ac662ec1E796f02",
  _9DNFT_OEQ: "0x74F8B79500084AEBA15888AF5bD60B64c7974C6c",
  _9DNFT_UEQ: "0x6Bd0861447f9996332D4b9c02d811b57E5f6a7F5",
  // Change pro
  _9DNFT_HEQ: "0x47F13F866aa60D4Ca66bE166Dc029E23009d8100",
  _9DNFT_MAT: "0x7d167A9c3DD9461f293d94b416947A710e9A1487",
  _9DNFT_GEM: "0x2C81Dec76235155b066B4187985B00ca4214D482",
  _9DNFT_DGBX: "0x2687256010F3c0D794afbc712e900bBC530f241a",
  _9DNFT_LEBX: "0x4466adB5154c49A67189a3E835573833497965de",
  _9DNFT_EPBX: "0x1e680655Bb370113FaF60f1FAeBe01f9D5fc8d52",
  _9DNFT_HRBX: "0xCE64a22439d47D25692D9414136E940EF0a2A14a",
  _9DNFT_MTBX: "0xb91F850076FBc8aC908dF327e199FDCA7041c108",
  _9DNFT_MARKET_CONTRACT: "0xCAF0498928C6704104d499DBF57Ea06856c1DA52",
  // Change pro
  _9DNFT_SIBX: "0x54F742FDEFdf569ECaD5f23Ea75252540f374C50",
  _9DNFT_GOBX: "0xA8Ad6B4D83015Aecc1d7E14EBB927a8F2bfD3C23",
  _9DNFT_PLBX: "0x3CF8d2781f1770A49e62ED40f1A2EeC12b50dE1a",
  _9DNFT_DIBX: "0x8b847c1a260d3dA0884D1cfBfD7c726BBDbb5f6F",
  _9DNFT_MYBX: "0xac0e8F7f4818EE1b4e9C29eb52Ef2d566b4CE1a6",
  //
  BUSD_CONTRACT: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
  _GALIX_BRIDGE: "0x7e701A98D9408c5609D0a409723A313D3739f721",
};

// test net cogi
const _testnetCogi = {
  // NEMO
  NEMO_CONTRACT: "0x1c753dD9955782aC974798A6f65dfFe03f217841",
  NEMO_HOTWALLET: "0x4d244ce366B5D2E38aeE0aF66af3615a7ed7496b",
  // Wrapped COGI
  COGI_CONTRACT: "0xe27ee69b15924685658B54D7f154452de26F5E2F",
  COGI_HOTWALLET: "0x982AD266A33fc9750632520005f3E811B6902b16",
  // ERC20 COD
  COD_CONTRACT: "0x544D9f7ed1537E27E74CFB68c4184A16fc0d50Cc",
  COD_HOTWALLET: "0x8eaF36eabb8C469344eccbe5A5cFb20bC4130B62",
  USDT_CONTRACT: "0x6a4D0e491ddc2D817baF8Ea0AEA23A9b709d61B3", // 1
  // Marketplace 9DNFT
  _9DNFT_MARKET_CONTRACT: "0x5c60Debe7cdE388cD9C8530e405D3E7a4572eE4A",
  _9DNFT_HRO: "0x61B410594DBa12136796fC6388e5abFa3ADF5274",
  _9DNFT_PET: "0xF5575eA92F32Ca507E18C61ad920aA0c0A912842",
  _9DNFT_MNT: "0x1852Fcd808537A57ecAEB65c7E000a2E2b1b5962",
  _9DNFT_BOX: "0x22efc4360224c7Baf84AEF563Cb4ac38D07d9A4c",
  _9DNFT_AEQ: "0xaE9f7975f5f4D11C759172d1d618bc816a4d7576",
  _9DNFT_OEQ: "0xd69bCe2e286447C9188A49eD1B15C2736C3C4341",
  _9DNFT_UEQ: "0xE066aB780411DE567b6Eb94d3Bf4853FC0f7A5ac",
  _9DNFT_HEQ: "0x8b5FC2aB2e210e420Ef062634730c90a0Ac7d5A2",
  _9DNFT_MAT: "0x9e27330f1B7D1B76759b12FAE4e1F2faAcdF2ceC",
  _9DNFT_GEM: "0x4907833CbD60BFBd2f11037b86760a9b7cFCB1dD",
  _9DNFT_PETN: "0xF745abE0Bb3f62C0C60a43AeCf6a18a6dAF60ad0",
  _9DNFT_DGBX: "0x9C18e541789B1feda8Ade2624ae5D9d750B3155f",
  _9DNFT_LEBX: "0x2D0e224afe5e57e942995645a5d5C13cfAddd1fB",
  _9DNFT_EPBX: "0x176386e8D2c0C055dbB88fcE6A18318727493512",
  _9DNFT_HRBX: "0xFa69ee52D0c7c50A1381Ab7438c6a053b2B11333",
  _9DNFT_MTBX: "0x61684d80d651042e164a8151D2a7C9ad26A5B30C",

  _9DNFT_SIBX: "0x6e6cEF1989f08139C415fb5c598Fe80332AA6e07",
  _9DNFT_GOBX: "0x5f86C9709361872c89893B847dd742Cb7f1f63D2",
  _9DNFT_PLBX: "0x9d0eFdD822AaBe08d1151904Df182b3744F33eC6",
  _9DNFT_DIBX: "0xBF3209113DD32DA605FBaD0E26c5aa00291346c4",
  _9DNFT_MYBX: "0x9b9Efc93fFda95dcC7455D0C2D3B47a6f7E36476",
  _9DNFT_ABOX: "0xCd913CD2112Dbb9c4B77B0Fbdbf62648bAe853AD",
  _9DNFT_DBOX: "0xDC0949eE5ad799e4bf4272964ee91775b1635FC2",
  _9DNFT_INO: "0x12655143dAfdcb89ED7555AE1000ED7fA70fc533",
  // Marketplace Galix
  _GALIX_BRIDGE: "0x74be7e352a6fa70759c57ac5746077071735cdf0",
  _GALIXNFT_RES: "0x33E02edb2c5847EA02FE4cb693E6b246ed0e8bAc",
  _GALIXNFT_HRO: "0x619c618bfC062C72Ef84882dD9544be9E513DbF4",
  _GALIXNFT_LAND: "0x05bD86Ba39a4Cd9b47f0b3C381f56f6273Da0425",
  _GALIXNFT_GBOX: "0x1c9891Eb0fbB5E36ebBBBABFef9Ec8C71b6Ac3de",
  _GALIXNFT_PBOX: "0x41ccAf06BcF9D8F8aBa348464635551fE6950947",
  _GALIXNFT_DBOX: "0x131a1a2a435b3ad09888f73b07d2128ca4c9c371",
  _GALIXNFT_MARKET_CONTRACT: "0x12655143dAfdcb89ED7555AE1000ED7fA70fc533",
  _GALIXNFT_INO: "0x12655143dAfdcb89ED7555AE1000ED7fA70fc533", // 1
  _TICKET_CONTRACT: "0xd2d3fA440A80e431D299Db71711d276a4127931d", // 1

  // Marketplace _Soul Realm
  _SOULREALM_N36YEQ: "0xDbfD2Ee372343c5050e0b2dA90984c809C2B3B74",
  _SOULREALM_N36OEQ: "0x07B17F67EEafE156A07Db73CF7e0bd455014e17a",
  _SOULREALM_N36REQ: "0xCB7464ceA3ecAF90691F661D045F1a2c5cD31537",
  _SOULREALM_N36PEQ: "0x8F82D94e00824372E7a8d11e1F8aE2FB0A30C2E3",
  _SOULREALM_N36BOX: "0xCfA86C86a7109716C346174f0D5b7F643a3f4d3e",
  _SOULREALM_N36PET: "0x9c01fade6CEB895a83e619E9a2BDCE09c29FBd10",
  _SOULREALM_N36PEG: "0xD7197BEeaC63a7B86c9791D9e5F43ccFac462431",
  _SOULREALM_N36FSH: "0x7bE79D1545ed43Df181E38b8F341A0c0E488c8fD",
  _SOULREALM_N36MAT: "0xe84E8097a16cc0687a87eB3eB6df036Fa8bEF102",
  _SOULREALM_N36GEM: "0xb5E707815d8Ab4C2Ef745C9257895F994E3502DA",
  _SOULREALM_MARKET_CONTRACT: "0xF1b39d93D1a7d4b15146911Fa3DFf3c577706aEf",

  // Marketplace _Marswar
  _MARSWAR_NFT_HRO: "0x75C3416167C36736ec7a0088DB9694E12B34E78F",
  _MARSWAR_NFT_WEP: "0x5f140cF7B3849e3F23637A584a07880FF4b7383b",
  _MARSWAR_NFT_GNR: "0x793b1D17FE82347c60bB74E0904F89B19918786d",
  _MARSWAR_MARKET_CONTRACT: "0xEEf00315ae2c73fDF7CA74B9116A29AbC920EB52",
  _MECHAWARFARENFT_MBOX: "0xf54eb3886625F0D850439E29FE491D39D700A3F0",
  _MECHAWARFARENFT_PBOX: "0x89A8D1df507CCb921312D9C137Fbe68e5488adC8",
  _MECHAWARFARENFT_SBOX: "0x1FfC5E0ca278f5fA7255FDE806e77643B7c0a005",
  _MECHAWARFARENFT_INO: "0x12655143dAfdcb89ED7555AE1000ED7fA70fc533",

  // Marketplace _Naruto
  _NARUTO_N33OEQ: "0xe5b012B1695Bf7A0b48703e244Bd2789Abb67Aae",
  _NARUTO_N33REQ: "0x8d72fA4Ca85A6cA2D75e1BF2cB51119cC82132dE",
  _NARUTO_N33PEQ: "0xD2Ea3d2fFD8Dac73D0b14F8c130aAbA233C3b99D",
  _NARUTO_N33BOX: "0xBC989219971691E6fF8a90f30EE09329182d18bE",
  _NARUTO_N33FSH: "0x4b40998ACa842f4aFD0757A708856e719f9D930a",
  _NARUTO_N33MAT: "0xCCaCCdF01c67397E47eBEA0E8F0eA96640ef0515",
  _NARUTO_N33GEM: "0x238141aF10A6bdc17073466c0fDCC901EB257203",
  _NARUTO_MARKET_CONTRACT: "0xb94d42175E8744c1410Ac4DF1750eFC4EcC972F1",
  // Marketplace _Flashpoint
  _FLASHPOINT_WEAPON: "0x95455fd59c09af42aac154f7e875cb0e470ba676",
  _FLASHPOINT_MARKET_CONTRACT: "0x03565147511b6235e4B20EBd4b9A8b60cf3cFCD3",
  _FLASHPOINT_NFT_BABOX: "0xe88EfBb528761B3e743D7297258f92BC4B637D79",
  _FLASHPOINT_NFT_GABOX: "0x27135cb9066b42E30bF4acB88f6816f9DA1cC447",
  _FLASHPOINT_NFT_PPBOX: "0x05831376F5600C49554cD3495E524A6EA51d71Fa",
  _FLASHPOINT_INO: "0x12655143dAfdcb89ED7555AE1000ED7fA70fc533",
  // Richwork
  _RICHWORK_FADR: "0x0d85446e6A452f5E8aA0759269C1c63DD2489317",
  _RICHWORK_FATY: "0x5bb5740D0d76AE8151e252cEFDb0b4DDe291AD74",
  _RICHWORK_FAFF: "0x76152d696809569c775437451406775248e1c260",
  _RICHWORK_FAHH: "0x80DbDA8B3A9C494B9257579C29279d656FADCB5D",
  _RICHWORK_FALO: "0x556A4d6Bf834527d67f7061e52fc103c64109d9E",
  _RICHWORK_MARKET_CONTRACT: "0x069B00f92a3F195f21Fa0Ca507d897851a62965c",
  // ScanRoot NFT
  _SCANROOT_NFT: "0xc234Ea088B712D0fCF274a9a4Ff8CE400302351c",
};
// net cogi
const _Cogi = {
  // NEMO
  NEMO_CONTRACT: "0xf538030Ba4B39E35A3576bD6698cfcc6AC34A81f", // 1
  NEMO_HOTWALLET: "0x4d244ce366B5D2E38aeE0aF66af3615a7ed7496b",
  // Wrapped COGI
  COGI_CONTRACT: "0x6cB755C4B82e11e727C05f697c790FdBC4253957", // 1
  COGI_HOTWALLET: "0x982AD266A33fc9750632520005f3E811B6902b16",
  // ERC20 COD
  COD_CONTRACT: "0x544D9f7ed1537E27E74CFB68c4184A16fc0d50Cc",
  COD_HOTWALLET: "0x8eaF36eabb8C469344eccbe5A5cFb20bC4130B62",
  USDT_CONTRACT: "0xaFE5A737968C1830B2A2b4062ce4B6763d4d8044", // 1
  // Marketplace 9DNFT
  _9DNFT_MARKET_CONTRACT: "0xF5604060B5a4eFd502FB4F6c4161DBe98A75d4c2",
  _9DNFT_HRO: "0xd2d3fA440A80e431D299Db71711d276a4127931d",
  _9DNFT_PET: "0x7d8fE76B1b692DD3062F77E236DD0eB23F2C04fd",
  _9DNFT_MNT: "0x0Ca011BFce1E57D2CFFC12E06F9E82cd03025b8c",
  _9DNFT_BOX: "0x68b55bd424A9411FF5e204107d9ADcCe7CDE4D51",
  _9DNFT_AEQ: "0x71502419aD23055A858a2C5d18e2aAf89F1b317b",
  _9DNFT_OEQ: "0xf4C4C571cb9D0890d9c3f996F7aE02790C532118",
  _9DNFT_UEQ: "0xFa621354E35b93f3b183E248b783A76A610f399E",
  _9DNFT_HEQ: "0x68389a8f6CBbC6e97E555DDdA430Ce66334Dc27E",
  _9DNFT_MAT: "0x6488afc50e9d1F3608E85D533B60f9Ae1155093e",
  _9DNFT_GEM: "0x734B9a496FceDEcd8099cd946537c2Da0F8F63ce",
  _9DNFT_PETN: "0x6092a03E6BFddcA685a25103948B5194C0D40576",

  _9DNFT_DGBX: "0x0dfA8BAe4f1a1F5031505D1794C6d3742702D7d2",
  _9DNFT_LEBX: "0xcb6658394b9721Bc02Abfc313ef22ad0b416BFBD",
  _9DNFT_EPBX: "0x681C3e547691CE09E8677E7fCb394D38834D4ad8",
  _9DNFT_HRBX: "0x114B21959D36c6f1e50CeDE9947CD27d3d8a0087",
  _9DNFT_MTBX: "0x222621495439CB60D1ef111E68c014195A21Ae5b",

  _9DNFT_SIBX: "0xD7A56977E455956aA2aece577129321c4C4Bdd7A",
  _9DNFT_GOBX: "0x5089631D62c9D3ea753Be318c0B1bD2E391Fe595",
  _9DNFT_PLBX: "0xB037C107a00745CC95ec68c67130a58eA1A41684",
  _9DNFT_DIBX: "0xDC945f0eE050dD4C2f10cB66BA65114937429887",
  _9DNFT_MYBX: "0x5a876DE9D3255A65E1658C9Ba825B5Bb1642BC6D",
  _9DNFT_ABOX: "0x52EAbE2A6904fB8FE20A7438E0DFb6fE505BC0b4",
  _9DNFT_DBOX: "0x97C1107B35EdB04DeeB3Bf4E00943b06497c4764",
  _9DNFT_INO: "0x6a6578520140CA2E43a4C97392A552C5186e3cf5",
  // Marketplace _Soul Realm
  _SOULREALM_MARKET_CONTRACT: "0x08fAf1A5D78B24F9c4Fd692457e975ea87f7438D",
  _SOULREALM_N36YEQ: "0xac743A7ae34Af333B715dfFf906Bb2d49dBF9183",
  _SOULREALM_N36OEQ: "0x8800A840a09Db95981b7C568cC9e6a94aC5483Cb",
  _SOULREALM_N36REQ: "0x43c78055a9E23a43099B9162B5C27345F6925C38",
  _SOULREALM_N36PEQ: "0x7B0c1F02330516325976d6ef87212a000FA2844e",
  _SOULREALM_N36BOX: "0x07F50aFC75F57a3c1C5482B3bf238a6F1ca28844",
  _SOULREALM_N36PET: "0x5bc0b95EfdFc890531E26375Ac508cB80e5580D9",
  _SOULREALM_N36PEG: "0x543bbeD353c50F0924d195169bAf822772c15811",
  _SOULREALM_N36FSH: "0x41831e49aC77A27bE673A1DF1906472AbeA85C2B",
  _SOULREALM_N36MAT: "0x4adE003E87912a98B011BEa3665304cBF297Ae53",
  _SOULREALM_N36GEM: "0x1AEdb842E7153F2D54491CDcdb29DCc8850e0A0E",

  // Marketplace Galix
  _GALIXNFT_RES: "0x99aa284f7e4E1483A0F424B1Ae70Fb6710024297", // 1
  _GALIXNFT_HRO: "0x4299eae6C68d6c630849835993c36ec6407C135c", // 1
  _GALIXNFT_LAND: "0xA798193E101D663636b55d1cF8745E0867A376D3", // 1
  _GALIXNFT_GBOX: "0xbf9aE4F2615d42A6003e37106614B90df5A81bC6", // 1
  _GALIXNFT_PBOX: "0xbD6e5827Afa8540B0E3f01C58c5B9EB3f37695Dd", // 1
  _GALIXNFT_DBOX: "0xDc525A85dB07621D11f7E8622E096807FB61a630", // 1
  _GALIXNFT_MARKET_CONTRACT: "0xAC34D57456Ee5f84E8904231394cEfd8176540c6", // 1
  _GALIXNFT_INO: "0xcb6658394b9721Bc02Abfc313ef22ad0b416BFBD",
  _TICKET_CONTRACT: "0xd2d3fA440A80e431D299Db71711d276a4127931d",

  //  MECHA WARFARE
  _MECHAWARFARE_NFT_HRO: "0xE1C42892789114A54F866595959c0F2Eb0F98808",
  _MECHAWARFARE_NFT_WEP: "0x5BE9e5516124F4637a61ee6f4D305A2FAd814C93",
  _MECHAWARFARE_NFT_GNR: "0xC363E1d5ae1EE2A0CBc2F7e98597673492df8cBA",

  _MECHAWARFARENFT_MBOX: "0x870b5A33e9cD7232302BE7ED22A6d5a2885ac08A",
  _MECHAWARFARENFT_PBOX: "0xBa78728d693c1F0b1024eE5198f7a5dEf1298CEd",
  _MECHAWARFARENFT_SBOX: "0xCC0ad0cea929Bdecc564180B0Fa530D1D40aCa42",

  _MECHAWARFARENFT_INO: "0x6a6578520140CA2E43a4C97392A552C5186e3cf5",
  _MARSWAR_MARKET_CONTRACT: "0xd1AB7C8064a901cA75Bac0574eA64ef70A426F66",

  // Marketplace _Naruto
  _NARUTO_N33OEQ: "0xe5b012B1695Bf7A0b48703e244Bd2789Abb67Aae",
  _NARUTO_N33REQ: "0x8d72fA4Ca85A6cA2D75e1BF2cB51119cC82132dE",
  _NARUTO_N33PEQ: "0xD2Ea3d2fFD8Dac73D0b14F8c130aAbA233C3b99D",
  _NARUTO_N33BOX: "0xBC989219971691E6fF8a90f30EE09329182d18bE",
  _NARUTO_N33FSH: "0x4b40998ACa842f4aFD0757A708856e719f9D930a",
  _NARUTO_N33MAT: "0xCCaCCdF01c67397E47eBEA0E8F0eA96640ef0515",
  _NARUTO_N33GEM: "0x238141aF10A6bdc17073466c0fDCC901EB257203",
  _NARUTO_MARKET_CONTRACT: "0xb94d42175E8744c1410Ac4DF1750eFC4EcC972F1",
  // Richwork
  _RICHWORK_FADR: "0x0d85446e6A452f5E8aA0759269C1c63DD2489317",
  _RICHWORK_FATY: "0x5bb5740D0d76AE8151e252cEFDb0b4DDe291AD74",
  _RICHWORK_FAFF: "0x76152d696809569c775437451406775248e1c260",
  _RICHWORK_FAHH: "0x80DbDA8B3A9C494B9257579C29279d656FADCB5D",
  _RICHWORK_FALO: "0x556A4d6Bf834527d67f7061e52fc103c64109d9E",
  _RICHWORK_MARKET_CONTRACT: "0x069B00f92a3F195f21Fa0Ca507d897851a62965c",
  // Marketplace _Flashpoint
  _FLASHPOINT_WEAPON: "0xfd14718050E6194763f231a6ac63d52E7e5A33E3",
  _FLASHPOINT_MARKET_CONTRACT: "0xCE6fCBbed1A09adaACa1aE899DdCC21C6B8ca3d7",
  _FLASHPOINT_NFT_BABOX: "0xf577Be912cdBbB3e3dBFf43CfbcBed6c4439121F",
  _FLASHPOINT_NFT_GABOX: "0xE318cBc117C1093Ef53c8BAcbDF6BA704E0a980e",
  _FLASHPOINT_NFT_PPBOX: "0xc3AC6dD27b09f3382af9F9Fc6856C3E09DDC6989",
  _FLASHPOINT_INO: "0x6a6578520140CA2E43a4C97392A552C5186e3cf5",
  // ScanRoot NFT
  _SCANROOT_NFT: "0xc234Ea088B712D0fCF274a9a4Ff8CE400302351c",
};

///
const contracts: IContract[] = [
  {
    chainId: 43113,
    namespace: "cogi_coin",
    address: _preAvax.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43113,
    namespace: "galix_coin",
    address: _preAvax.GALIX_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43113,
    namespace: "galix_hotwallet",
    address: _preAvax.GALIX_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 43113,
    namespace: "nemo_coin",
    address: _preAvax.NEMO_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43113,
    namespace: "nemo_hotwallet",
    address: _preAvax.NEMO_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 43113,
    namespace: "cogicoin",
    address: _preAvax.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43113,
    namespace: "usdt_coin",
    address: _preAvax.USDT_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43113,
    namespace: "v6galix_coin",
    address: _preAvax.V6GALIX_CONTRACT,
    abi: GalixERC20Abi,
  },
  ///
  {
    chainId: 43114,
    namespace: "cogi_coin",
    address: _avax.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43114,
    namespace: "galix_coin",
    address: _avax.GALIX_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43114,
    namespace: "galix_hotwallet",
    address: _avax.GALIX_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 43114,
    namespace: "nemo_coin",
    address: _avax.NEMO_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43114,
    namespace: "nemo_hotwallet",
    address: _avax.NEMO_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 43114,
    namespace: "nemo_hotwallet",
    address: _preAvax.NEMO_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 43114,
    namespace: "usdt_coin",
    address: _avax.USDT_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 43114,
    namespace: "v6galix_coin",
    address: _avax.V6GALIX_CONTRACT,
    abi: GalixERC20Abi,
  },
  ///
  {
    chainId: 97,
    namespace: "nemo_coin",
    address: _prebsc.NEMO_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 97,
    namespace: "cogi_coin",
    address: _prebsc.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 97,
    namespace: "cogi_hotwallet",
    address: _prebsc.COGI_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 97,
    namespace: "cod_coin",
    address: _prebsc.COD_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 97,
    namespace: "cod_hotwallet",
    address: _prebsc.COD_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 97,
    namespace: "usdt_coin",
    address: _prebsc.USDT_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 97,
    namespace: "busd_contract",
    address: _prebsc.BUSD_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 97,
    namespace: "erc20_bridge",
    address: _prebsc._GALIX_BRIDGE,
    abi: GalixBridgeAbi,
  },
  //
  {
    chainId: 56,
    namespace: "nemo_coin",
    address: _bsc.NEMO_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 56,
    namespace: "cogi_coin",
    address: _bsc.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 56,
    namespace: "cogi_hotwallet",
    address: _bsc.COGI_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 56,
    namespace: "cod_coin",
    address: _bsc.COD_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 56,
    namespace: "cod_hotwallet",
    address: _bsc.COD_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 56,
    namespace: "usdt_coin",
    address: _bsc.USDT_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 56,
    namespace: "erc20_bridge",
    address: _bsc._GALIX_BRIDGE,
    abi: GalixBridgeAbi,
  },
  {
    chainId: 56,
    namespace: "busd_contract",
    address: _bsc.BUSD_CONTRACT,
    abi: GalixERC20Abi,
  },
  // Test net Cogi
  {
    chainId: 5555,
    namespace: "usdt_coin",
    address: _testnetCogi.USDT_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 5555,
    namespace: "cogi_coin",
    address: _testnetCogi.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 5555,
    namespace: "cogi_hotwallet",
    address: _testnetCogi.COGI_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 5555,
    namespace: "cod_coin",
    address: _testnetCogi.COD_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 5555,
    namespace: "cod_hotwallet",
    address: _testnetCogi.COD_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721market_9dnft",
    address: _testnetCogi._9DNFT_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_hro",
    address: _testnetCogi._9DNFT_HRO,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_pet",
    address: _testnetCogi._9DNFT_PET,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_petn",
    address: _testnetCogi._9DNFT_PETN,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_mnt",
    address: _testnetCogi._9DNFT_MNT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_box",
    address: _testnetCogi._9DNFT_BOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_aeq",
    address: _testnetCogi._9DNFT_AEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_oeq",
    address: _testnetCogi._9DNFT_OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_ueq",
    address: _testnetCogi._9DNFT_UEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_heq",
    address: _testnetCogi._9DNFT_HEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_mat",
    address: _testnetCogi._9DNFT_MAT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_gem",
    address: _testnetCogi._9DNFT_GEM,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },

  // INO BOX
  {
    chainId: 5555,
    namespace: "erc721_9dnft_hrbx",
    address: _testnetCogi._9DNFT_HRBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_epbx",
    address: _testnetCogi._9DNFT_EPBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_lebx",
    address: _testnetCogi._9DNFT_LEBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_dgbx",
    address: _testnetCogi._9DNFT_DGBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_mtbx",
    address: _testnetCogi._9DNFT_MTBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  // Stake Box
  {
    chainId: 5555,
    namespace: "erc721_9dnft_sibx",
    address: _testnetCogi._9DNFT_SIBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_gobx",
    address: _testnetCogi._9DNFT_GOBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_plbx",
    address: _testnetCogi._9DNFT_PLBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_dibx",
    address: _testnetCogi._9DNFT_DIBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_mybx",
    address: _testnetCogi._9DNFT_MYBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_abox",
    address: _testnetCogi._9DNFT_ABOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_dbox",
    address: _testnetCogi._9DNFT_DBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc721_9dnft_ino",
    address: _testnetCogi._9DNFT_INO,
    abi: KogiINOMarketAbi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 5555,
    namespace: "erc20_bridge",
    address: _testnetCogi._GALIX_BRIDGE,
    abi: GalixBridgeAbi,
  },
  // Galix
  {
    chainId: 5555,
    namespace: "nemo_coin",
    address: _testnetCogi.NEMO_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 5555,
    namespace: "nemo_hotwallet",
    address: _testnetCogi.NEMO_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721market_galixnft",
    address: _testnetCogi._GALIXNFT_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721_galix_resource",
    address: _testnetCogi._GALIXNFT_RES,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 5555,
    namespace: "erc721_galix_hero",
    address: _testnetCogi._GALIXNFT_HRO,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 5555,
    namespace: "erc721_galix_land",
    address: _testnetCogi._GALIXNFT_LAND,
    abi: GalixERC721LandIfaceAbi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 5555,
    namespace: "erc721_galix_gbox",
    address: _testnetCogi._GALIXNFT_GBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 5555,
    namespace: "erc721_galix_pbox",
    address: _testnetCogi._GALIXNFT_PBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 5555,
    namespace: "erc721_galix_dbox",
    address: _testnetCogi._GALIXNFT_DBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 5555,
    namespace: "erc721_galixnft_ino",
    address: _testnetCogi._GALIXNFT_INO,
    abi: KogiINOMarketAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721_galixnft_ticket",
    address: _testnetCogi._TICKET_CONTRACT,
    abi: GalixERC20Abi,
  },
  // _Spirit Land
  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36yeq",
    address: _testnetCogi._SOULREALM_N36YEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36oeq",
    address: _testnetCogi._SOULREALM_N36OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36req",
    address: _testnetCogi._SOULREALM_N36REQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36peq",
    address: _testnetCogi._SOULREALM_N36PEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36box",
    address: _testnetCogi._SOULREALM_N36BOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36pet",
    address: _testnetCogi._SOULREALM_N36PET,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36peg",
    address: _testnetCogi._SOULREALM_N36PEG,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36fsh",
    address: _testnetCogi._SOULREALM_N36FSH,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36oeq",
    address: _testnetCogi._SOULREALM_N36OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36mat",
    address: _testnetCogi._SOULREALM_N36MAT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 5555,
    namespace: "erc721_soulrealm_n36gem",
    address: _testnetCogi._SOULREALM_N36GEM,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 5555,
    namespace: "spiritland_erc721_market",
    address: _testnetCogi._SOULREALM_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },

  // _Naruto

  {
    chainId: 5555,
    namespace: "erc721_naruto_n33oeq",
    address: _testnetCogi._NARUTO_N33OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },
  {
    chainId: 5555,
    namespace: "erc721_naruto_n33req",
    address: _testnetCogi._NARUTO_N33REQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },
  {
    chainId: 5555,
    namespace: "erc721_naruto_n33peq",
    address: _testnetCogi._NARUTO_N33PEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 5555,
    namespace: "erc721_naruto_n33box",
    address: _testnetCogi._NARUTO_N33BOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 5555,
    namespace: "erc721_naruto_n33fsh",
    address: _testnetCogi._NARUTO_N33FSH,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 5555,
    namespace: "erc721_naruto_n33mat",
    address: _testnetCogi._NARUTO_N33MAT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 5555,
    namespace: "erc721_naruto_n33gem",
    address: _testnetCogi._NARUTO_N33GEM,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 5555,
    namespace: "naruto_erc721_market",
    address: _testnetCogi._NARUTO_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },

  // Mecha Warfare
  {
    chainId: 5555,
    namespace: "erc721_marswar_n81hro",
    address: _testnetCogi._MARSWAR_NFT_HRO,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 5555,
    namespace: "erc721_marswar_n81wep",
    address: _testnetCogi._MARSWAR_NFT_WEP,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 5555,
    namespace: "erc721_marswar_n81gnr",
    address: _testnetCogi._MARSWAR_NFT_GNR,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 5555,
    namespace: "erc721_mecha_warfare_mbox",
    address: _testnetCogi._MECHAWARFARENFT_MBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 5555,
    namespace: "erc721_mecha_warfare_pbox",
    address: _testnetCogi._MECHAWARFARENFT_PBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 5555,
    namespace: "erc721_mecha_warfare_sbox",
    address: _testnetCogi._MECHAWARFARENFT_SBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 5555,
    namespace: "erc721_marswar_market",
    address: _testnetCogi._MARSWAR_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721_marswar_ino",
    address: _testnetCogi._MECHAWARFARENFT_INO,
    abi: KogiINOMarketAbi,
  },
  // FlashPoint
  {
    chainId: 5555,
    namespace: "erc721_flashpoint_weapon",
    address: _testnetCogi._FLASHPOINT_WEAPON,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_flashpoint_babox",
    address: _testnetCogi._FLASHPOINT_NFT_BABOX,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_flashpoint_gabox",
    address: _testnetCogi._FLASHPOINT_NFT_GABOX,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_flashpoint_ppbox",
    address: _testnetCogi._FLASHPOINT_NFT_PPBOX,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721market_flashpointnft",
    address: _testnetCogi._FLASHPOINT_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721_flashpoint_ino",
    address: _testnetCogi._FLASHPOINT_INO,
    abi: KogiINOMarketAbi,
  },
  // Richwork Family
  {
    chainId: 5555,
    namespace: "erc721_richworkfarmfamily_fadr",
    address: _testnetCogi._RICHWORK_FADR,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_richworkfarmfamily_faty",
    address: _testnetCogi._RICHWORK_FATY,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_richworkfarmfamily_faff",
    address: _testnetCogi._RICHWORK_FAFF,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_richworkfarmfamily_fahh",
    address: _testnetCogi._RICHWORK_FAHH,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721_richworkfarmfamily_falo",
    address: _testnetCogi._RICHWORK_FALO,
    abi: GalixERC721Abi,
  },
  {
    chainId: 5555,
    namespace: "erc721market_richworkfarmfamilynft",
    address: _testnetCogi._RICHWORK_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 5555,
    namespace: "erc721_scanroot_nft",
    address: _testnetCogi._SCANROOT_NFT,
    abi: OPSERC721Abi,
  },
  {
    chainId: 76923,
    namespace: "erc20_bridge",
    address: _testnetCogi._GALIX_BRIDGE,
    abi: GalixBridgeAbi,
  },
  // COGI LIVE
  {
    chainId: 76923,
    namespace: "usdt_coin",
    address: _Cogi.USDT_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 76923,
    namespace: "nemo_coin",
    address: _Cogi.NEMO_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 76923,
    namespace: "cogi_coin",
    address: _Cogi.COGI_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 76923,
    namespace: "cogi_hotwallet",
    address: _Cogi.COGI_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 76923,
    namespace: "cod_coin",
    address: _Cogi.COD_CONTRACT,
    abi: GalixERC20Abi,
  },
  {
    chainId: 76923,
    namespace: "cod_hotwallet",
    address: _Cogi.COD_HOTWALLET,
    abi: GalixERC20HotWalletAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721market_9dnft",
    address: _Cogi._9DNFT_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_hro",
    address: _Cogi._9DNFT_HRO,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_pet",
    address: _Cogi._9DNFT_PET,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_petn",
    address: _Cogi._9DNFT_PETN,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_mnt",
    address: _Cogi._9DNFT_MNT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_box",
    address: _Cogi._9DNFT_BOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_aeq",
    address: _Cogi._9DNFT_AEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_oeq",
    address: _Cogi._9DNFT_OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_ueq",
    address: _Cogi._9DNFT_UEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_heq",
    address: _Cogi._9DNFT_HEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_mat",
    address: _Cogi._9DNFT_MAT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_gem",
    address: _Cogi._9DNFT_GEM,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },

  // INO BOX
  {
    chainId: 76923,
    namespace: "erc721_9dnft_hrbx",
    address: _Cogi._9DNFT_HRBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_epbx",
    address: _Cogi._9DNFT_EPBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_lebx",
    address: _Cogi._9DNFT_LEBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_dgbx",
    address: _Cogi._9DNFT_DGBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_mtbx",
    address: _Cogi._9DNFT_MTBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  // Stake Box
  {
    chainId: 76923,
    namespace: "erc721_9dnft_sibx",
    address: _Cogi._9DNFT_SIBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_gobx",
    address: _Cogi._9DNFT_GOBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_plbx",
    address: _Cogi._9DNFT_PLBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_dibx",
    address: _Cogi._9DNFT_DIBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_mybx",
    address: _Cogi._9DNFT_MYBX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_abox",
    address: _Cogi._9DNFT_ABOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_dbox",
    address: _Cogi._9DNFT_DBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._9DNFT,
  },
  {
    chainId: 76923,
    namespace: "erc721_9dnft_ino",
    address: _Cogi._9DNFT_INO,
    abi: KogiINOMarketAbi,
    service_id: SERVICE_ID._9DNFT,
  },
  // _SOUL_REALM
  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36yeq",
    address: _Cogi._SOULREALM_N36YEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36oeq",
    address: _Cogi._SOULREALM_N36OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36req",
    address: _Cogi._SOULREALM_N36REQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36peq",
    address: _Cogi._SOULREALM_N36PEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36box",
    address: _Cogi._SOULREALM_N36BOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36pet",
    address: _Cogi._SOULREALM_N36PET,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36peg",
    address: _Cogi._SOULREALM_N36PEG,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36fsh",
    address: _Cogi._SOULREALM_N36FSH,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36oeq",
    address: _Cogi._SOULREALM_N36OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36mat",
    address: _Cogi._SOULREALM_N36MAT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },

  {
    chainId: 76923,
    namespace: "erc721_soulrealm_n36gem",
    address: _Cogi._SOULREALM_N36GEM,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._SOUL_REALM,
  },
  {
    chainId: 76923,
    namespace: "spiritland_erc721_market",
    address: _Cogi._SOULREALM_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },

  // _Naruto

  {
    chainId: 76923,
    namespace: "erc721_naruto_n33oeq",
    address: _Cogi._NARUTO_N33OEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },
  {
    chainId: 76923,
    namespace: "erc721_naruto_n33req",
    address: _Cogi._NARUTO_N33REQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },
  {
    chainId: 76923,
    namespace: "erc721_naruto_n33peq",
    address: _Cogi._NARUTO_N33PEQ,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 76923,
    namespace: "erc721_naruto_n33box",
    address: _Cogi._NARUTO_N33BOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 76923,
    namespace: "erc721_naruto_n33fsh",
    address: _Cogi._NARUTO_N33FSH,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 76923,
    namespace: "erc721_naruto_n33mat",
    address: _Cogi._NARUTO_N33MAT,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 76923,
    namespace: "erc721_naruto_n33gem",
    address: _Cogi._NARUTO_N33GEM,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._NARUTO,
  },

  {
    chainId: 76923,
    namespace: "naruto_erc721_market",
    address: _Cogi._NARUTO_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },

  // Galix Mainnet
  {
    chainId: 76923,
    namespace: "erc721market_galixnft",
    address: _Cogi._GALIXNFT_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_galix_resource",
    address: _Cogi._GALIXNFT_RES,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 76923,
    namespace: "erc721_galix_hero",
    address: _Cogi._GALIXNFT_HRO,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 76923,
    namespace: "erc721_galix_land",
    address: _Cogi._GALIXNFT_LAND,
    abi: GalixERC721LandIfaceAbi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 76923,
    namespace: "erc721_galix_gbox",
    address: _Cogi._GALIXNFT_GBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 76923,
    namespace: "erc721_galix_pbox",
    address: _Cogi._GALIXNFT_PBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 76923,
    namespace: "erc721_galix_dbox",
    address: _Cogi._GALIXNFT_DBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._GALIXCITY,
  },
  {
    chainId: 76923,
    namespace: "erc721_galixnft_ino",
    address: _Cogi._GALIXNFT_INO,
    abi: KogiINOMarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_galixnft_ticket",
    address: _Cogi._TICKET_CONTRACT,
    abi: GalixERC20Abi,
  },

  // Mecha Warfare
  {
    chainId: 76923,
    namespace: "erc721_marswar_n81hro",
    address: _Cogi._MECHAWARFARE_NFT_HRO,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 76923,
    namespace: "erc721_marswar_n81wep",
    address: _Cogi._MECHAWARFARE_NFT_WEP,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 76923,
    namespace: "erc721_marswar_n81gnr",
    address: _Cogi._MECHAWARFARE_NFT_GNR,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 76923,
    namespace: "erc721_mecha_warfare_mbox",
    address: _Cogi._MECHAWARFARENFT_MBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 76923,
    namespace: "erc721_mecha_warfare_pbox",
    address: _Cogi._MECHAWARFARENFT_PBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 76923,
    namespace: "erc721_mecha_warfare_sbox",
    address: _Cogi._MECHAWARFARENFT_SBOX,
    abi: GalixERC721Abi,
    service_id: SERVICE_ID._MARSWAR,
  },
  {
    chainId: 76923,
    namespace: "erc721_marswar_market",
    address: _Cogi._MARSWAR_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_marswar_ino",
    address: _Cogi._MECHAWARFARENFT_INO,
    abi: KogiINOMarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_flashpoint_weapon",
    address: _Cogi._FLASHPOINT_WEAPON,
    abi: GalixERC721Abi,
  },
  {
    chainId: 76923,
    namespace: "erc721_flashpoint_babox",
    address: _Cogi._FLASHPOINT_NFT_BABOX,
    abi: GalixERC721Abi,
  },
  {
    chainId: 76923,
    namespace: "erc721_flashpoint_gabox",
    address: _Cogi._FLASHPOINT_NFT_GABOX,
    abi: GalixERC721Abi,
  },
  {
    chainId: 76923,
    namespace: "erc721_flashpoint_ppbox",
    address: _Cogi._FLASHPOINT_NFT_PPBOX,
    abi: GalixERC721Abi,
  },
  {
    chainId: 76923,
    namespace: "erc721market_flashpointnft",
    address: _Cogi._FLASHPOINT_MARKET_CONTRACT,
    abi: GalixERC721MarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_flashpoint_ino",
    address: _Cogi._FLASHPOINT_INO,
    abi: KogiINOMarketAbi,
  },
  {
    chainId: 76923,
    namespace: "erc721_scanroot_nft",
    address: _Cogi._SCANROOT_NFT,
    abi: OPSERC721Abi,
  },
];

export default contracts;
