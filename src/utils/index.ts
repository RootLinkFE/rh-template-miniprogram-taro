import Taro from "@tarojs/taro";
import * as commonUtil from "./common";

export const CommonUtil = commonUtil;

export function isH5() {
  return Taro.getEnv() === Taro.ENV_TYPE.WEB;
}

export function isWeapp() {
  return Taro.getEnv() === Taro.ENV_TYPE.WEAPP;
}

export function isDevEnv() {
  return process.env.NODE_ENV === "development";
}
