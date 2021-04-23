import {SubmittableResult} from "@polkadot/api";
import {DispatchError} from "@polkadot/types/interfaces";
import {EventMetadataLatest} from "@polkadot/types/interfaces/metadata";
import {ISubmittableResult} from "@polkadot/types/types";
import BN from "bn.js";
import React, {useState} from 'react';
import {Trans, useTranslation} from "react-i18next";
import config from "../../config";
import {useSubstrate} from "../index";
import {ApiState, KeyringState} from "../SubstrateContext";
import ExtrinsicFailed from "./ExtrinsicFailed";
import SignAndSubmit from "./SignAndSubmit";
import SubstrateLoading from "./SubstrateLoading";
import TransactionError from "./TransactionError";
import TransactionInProgress from "./TransactionInProgress";
import {getFromAcct, isNumType, transformParams} from "./utils";
import {getFromAcct, transformParams} from "./utils";
import {useAccounts} from "../hooks/useAccounts";

export interface Result {
    status: Status,
    event?: EventMetadataLatest,
    error?: ExtrinsicError,
}

export interface Status {
    isReady: boolean
    isInBlock: boolean
    isFinalized: boolean
}

export interface ExtrinsicError {
    section?: string
    name?: string
    description: string
}

export interface TxAttrs {
    palletRpc: string
    callable: string
    eventMethod: string
    inputParams?: InputParam[]
    eventDescription?: string
}

export interface InputParam {
    name: string
    optional?: boolean
    value: string
    type?: string
}

export interface Props {
    onClose: () => void
    onSuccess?: () => void
    txAttrs: TxAttrs
    setExtrinsicDetails: (data: { extrinsicHash: string, lastBlockHash: string }) => void
    title: string
    instruction: string | JSX.Element
}

const SubmittingTransaction: React.FC<Props> = ({onClose, onSuccess, txAttrs, setExtrinsicDetails, title, instruction}) => {
    const {t} = useTranslation()
    const [result, setResult] = useState<Result | undefined>()
    const [error, setError] = useState<any>()
    const [submitting, setSubmitting] = useState(false)
    const {keyringState, keyring, api, apiState} = useSubstrate();

    const accounts = useAccounts()

    const txResHandler = (result: SubmittableResult) => {
        const txResult = {status: result.status} as Result

        const applyExtrinsicEvent = result.events
            .find(({phase, event}) =>
                phase.isApplyExtrinsic && event.section === txAttrs.palletRpc && event.method === txAttrs.eventMethod
            )
        if (applyExtrinsicEvent) {
            txResult.event = applyExtrinsicEvent.event.meta
        }

        const extrinsicFailedEvent = result.events
            .find(({event: {section, method}}) =>
                section === 'system' && method === 'ExtrinsicFailed'
            )
        if (extrinsicFailedEvent) {
            const dispatchError = extrinsicFailedEvent.event.data[0] as DispatchError
            if ((dispatchError).isModule && api) {
                const decoded = api.registry.findMetaError((dispatchError).asModule);
                const {documentation, name, section} = decoded;
                txResult.error = {section, name, description: documentation.join(' ')}
            } else {
                txResult.error = {description: dispatchError.toString()}
            }
        }
        setResult(txResult)
    }

    const txErrHandler = (err: any) => {
        setError(err)
    }

    const signAndSend = async (address: string) => {
        const {palletRpc, callable, inputParams} = txAttrs;
        if (api === undefined) {
            return
        }

        const fromAcct = await getFromAcct(address, api, keyring);
        if (fromAcct === undefined) {
            return
        }

        // TODO should be set as general properties
        const chainInfo = await api.registry.getChainProperties()
        const tokenDecimals = chainInfo?.tokenDecimals.unwrapOr(undefined)?.toString()
        const parsedTokenDecimals = tokenDecimals ? parseInt(tokenDecimals) : NaN
        const decimals = !isNaN(parsedTokenDecimals) ? parsedTokenDecimals : 12

        const transformed = transformParams(inputParams, decimals);

        // transformed can be empty parameters
        const txExecute = transformed
            ? api.tx[palletRpc][callable](...transformed)
            : api.tx[palletRpc][callable]();

        // sign the transaction to get the proper extrinsic hash
        await txExecute.signAsync(fromAcct)

        const signedBlock = await api.rpc.chain.getBlock();
        setExtrinsicDetails({extrinsicHash: txExecute.hash.toString(), lastBlockHash: signedBlock.hash.toString()})

        // send the transaction
        await txExecute.send(txResHandler)
            .catch(txErrHandler);
    };

    const onSubmit = async (address: string) => {
        setSubmitting(true)
        await signAndSend(address)
    };

    if (apiState === ApiState.ERROR) {
        return <TransactionError
            onOk={onClose}
            title={t('substrate.error.api.title')}
            subtitle={t('substrate.error.api.subtitle', {networkName: config.NETWORK_NAME})}/>
    } else if (apiState !== ApiState.READY) {
        return <SubstrateLoading onOk={onClose}/>
    } else if (keyringState !== KeyringState.READY || (keyringState === KeyringState.READY && accounts.length === 0)) {
        return <TransactionError
            onOk={onClose}
            title={t('substrate.error.accounts.title')}
            subtitle={<Trans id='modal-description'
                             i18nKey="substrate.error.accounts.subtitle"
                             components={{a: <a href='https://polkadot.js.org/extension/'/>}}/>}
        />
    } else if (!submitting) {
        return (
            <SignAndSubmit title={title} instruction={instruction} txAttrs={txAttrs} onCancel={onClose}
                           onSubmit={onSubmit}/>
        )
    } else if (result && result.error) {
        return <ExtrinsicFailed error={result.error} onOk={onClose}/>
    } else if (error) {
        return <TransactionError
            error={error}
            onOk={onClose}
            title={t('substrate.error.transaction.title', {networkName: config.NETWORK_NAME})}/>
    } else {
        return <TransactionInProgress status={result?.status} event={result?.event} onOk={onSuccess ?? onClose} eventDescription={txAttrs.eventDescription}/>
    }
}

export default SubmittingTransaction
