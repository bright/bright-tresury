import {web3FromSource} from '@polkadot/extension-dapp';
import {KeyringPair} from "@polkadot/keyring/types";
import React, {useState} from 'react';
import {Button} from "../../components/button/Button";
import {useSubstrate} from '../index';
import utils from './utils';

interface InputParam {
    name: string
    optional?: boolean
    value: string
    type?: string
}

export interface TxAttrs {
    palletRpc: string,
    callable: string,
    inputParams?: InputParam[],
}

interface TxButtonProps {
    address: string,
    label: string,
    setStatus: (status: string) => void,
    attrs: TxAttrs,
    disabled?: boolean,
}

const TxButton: React.FC<TxButtonProps> = ({address, label, setStatus, attrs, disabled = false}) => {
    const {api, keyring} = useSubstrate();
    const [unsub, setUnsub] = useState<(() => void) | undefined>(undefined);

    const {palletRpc, callable, inputParams} = attrs;

    const getFromAcct = async (): Promise<string | KeyringPair | undefined> => {
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

    const txResHandler = ({status}: { status: any }) =>
        status.isFinalized
            ? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
            : setStatus(`Current transaction status: ${status.type}`);

    const txErrHandler = (err: any) =>
        setStatus(`😞 Transaction Failed: ${err.toString()}`);

    const signAndSend = async () => {
        if (api === undefined) {
            return
        }

        const fromAcct = await getFromAcct();
        if (fromAcct === undefined) {
            return
        }

        const transformed = transformParams();
        // transformed can be empty parameters

        const txExecute = transformed
            ? api.tx[palletRpc][callable](...transformed)
            : api.tx[palletRpc][callable]();

        const unsub = await txExecute.signAndSend(fromAcct, txResHandler)
            .catch(txErrHandler);
        setUnsub(() => unsub);
    };

    const handleClick = async () => {
        if (unsub !== undefined) {
            await unsub();
            setUnsub(undefined);
        }

        setStatus('Sending...');

        await signAndSend()
    };

    const transformParams = (): any[] => {
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
                const converted = value.indexOf('.') >= 0 ? Number.parseFloat(value) : Number.parseInt(value);
                return [...memo, converted];
            }
            return [...memo, value];
        }, []);
    };

    const isNumType = (type: string) =>
        utils.paramConversion.num.some(el => type.indexOf(el) >= 0);

    const allParamsFilled = () => {
        if (inputParams === undefined || inputParams.length === 0) {
            return true
        }

        return inputParams.every((param: InputParam) => {
            if (param.optional) {
                return true;
            }
            if (param.value === null || param.value === undefined) {
                return false;
            }

            const value = typeof param === 'object' ? param.value : param;
            return value !== null && value !== '' && value !== undefined;
        });
    };

    return (
        <Button
            color='primary'
            type='submit'
            onClick={handleClick}
            disabled={disabled || !palletRpc || !callable || !allParamsFilled() || !address || !api}
        >
            {label}
        </Button>
    );
}

export {TxButton};
