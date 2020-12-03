import ApiPromise from "@polkadot/api/promise";
import {web3FromSource} from "@polkadot/extension-dapp";
import {KeyringPair} from "@polkadot/keyring/types";
import {Keyring} from "@polkadot/ui-keyring";
import BigNumber from "bignumber.js";
import {InputParam} from "./SubmittingTransaction";

export const utils = {
  paramConversion: {
    num: [
      'Compact<Balance>',
      'BalanceOf',
      'u8', 'u16', 'u32', 'u64', 'u128',
      'i8', 'i16', 'i32', 'i64', 'i128'
    ]
  }
};

export const isNumType = (type: string) =>
    utils.paramConversion.num.some(el => type.indexOf(el) >= 0);

export const getFromAcct = async (address: string, api?: ApiPromise, keyring?: Keyring): Promise<string | KeyringPair | undefined> => {
  if (api === undefined || address === '') {
    return undefined
  }
  const accountPair = keyring?.getPair(address)
  if (accountPair === undefined) {
    return undefined
  }
  if (!accountPair.meta.isInjected) {
    return accountPair
  }

  // signer is from Polkadot-js browser extension
  const injected = await web3FromSource(accountPair.meta.source as string);
  api.setSigner(injected.signer);
  const fromAcct = accountPair.address;

  return fromAcct;
};

export const transformParams = (inputParams?: InputParam[]): any[] => {
  const trimmedParams = inputParams ? inputParams.map((inputParam: InputParam) => {
    return {...inputParam, value: inputParam.value.trim()}
  }) : []

  return trimmedParams.reduce((memo: any[], {type = 'string', value}) => {
    if (value == null || value === '') {
      return memo;
    }

    // Deal with a vector
    if (type.indexOf('Vec<') >= 0) {
      const splitted = value.split(',').map((e: string) => e.trim());
      const mapped = splitted.map((single: string) => isNumType(type)
          ? (single.indexOf('.') >= 0 ? Number.parseFloat(single) : Number.parseInt(single))
          : single
      );
      return [...memo, mapped];
    }

    // Deal with a single value
    if (isNumType(type)) {
      let bn = new BigNumber(value)
      let pow = new BigNumber('1e+16')
      bn = bn.times(pow)
      // const converted = value.indexOf('.') >= 0 ? Number.parseFloat(value) : Number.parseInt(value);
      const converted = bn
      console.log(converted)
      return [...memo, converted];
    }
    return [...memo, value];
  }, []);
};