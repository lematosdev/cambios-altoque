export interface searchParams {
  page: number;
  rows: number;
  publisherType: string | null;
  asset: string;
  tradeType: string;
  transAmount: string;
  fiat: string;
  payTypes: string[];
}

export interface P2PResponse {
  code: string;
  message: string | null;
  messageDetail: string | null;
  data: Data[];
  total: number;
  success: boolean;
}

export interface Data {
  adv: Adv;
  advertiser: Advertiser;
}

interface Advertiser {
  userNo: string;
  realName: string | null;
  nickName: string | null;
  margin: number | null;
  marginUnit: string | null;
  orderCount: number | null;
  monthOrderCount: number | null;
  monthFinishRate: number | null;
  advConfirmTime: number | null;
  email: string | null;
  userType: string | null;
  tagIconUrls: string[] | null;
  userGrade: number | null;
  userIdentity: string | null;
  proMerchant: boolean | null;
  isBlocked: boolean | null;
}

interface Adv {
  advNo: string;
  classify: string;
  tradeType: string;
  asset: string;
  fiatUnit: string;
  advStatus: string | null;
  priceType: string | null;
  priceFloatingRatio: string | null;
  price: string;
  initAmount: string;
  surplusAmount: string;
  amountAfterEditing: string;
  maxSingleTransAmount: string;
  minSingleTransAmount: string;
  buyerKycLimit: string | null;
  buyerRegDaysLimit: string | null;
  buyerBtcPositionLimit: string | null;
  remarks: string | null;
  autoReplyMsg: string;
  payTimeLimit: number;
  tradeMethods: TradeMethod[];
  userTradeCountFilterTime: string | null;
  userBuytradeCountMin: string | null;
  userBuytradeCountMax: string | null;
  userSelltradeCountMin: string | null;
  userSelltradeCountMax: string | null;
  userAlltradeCountMin: string | null;
  userAlltradeCountMax: string | null;
  userTradeCompleteRateFilterTime: string | null;
  userTradeCompleteCountMin: string | null;
  userTradeCompleteRateMin: string | null;
  userTradeVolumeFilterTime: string | null;
  userTradeType: string | null;
  userTradeVolumeMin: string | null;
  userTradeVolumeMax: string | null;
  userTradeVolumeAsset: string | null;
  createTime: string | null;
  advUpdateTime: string | null;
  fiatVo: string | null;
  assetVo: string | null;
  advVisibleRet: string | null;
  assetLogo: string | null;
  assetSacle: number;
  fiatScale: number;
  priceScale: number;
  fiatSymbol: string;
  isTradable: boolean;
  dynamicMaxSingleTransAmount: string | null;
  minSingleTransQuantity: string | null;
  maxSingleTransQuantity: string | null;
  dynamicMaxSingleTransQuantity: string | null;
  tradableQuantity: string | null;
  commissionRate: string | null;
  tradeMethoodCommissionRate: string | null;
  launchCountry: string | null;
}

interface TradeMethod {
  payId: string | null;
  payMethodId: string;
  payType: string;
  payAccount: string | null;
  payBank: string | null;
  paySubBank: string | null;
  identifier: string;
  iconUrlColor: string;
  tradeMethodName: string;
  tradeMethodShortName: string | null;
  tradeMethodBgColor: string;
}
