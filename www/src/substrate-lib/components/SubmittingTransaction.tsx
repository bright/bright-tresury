import {Box} from "@material-ui/core";
import {DispatchError} from "@polkadot/types/interfaces";
import {EventMetadataLatest} from "@polkadot/types/interfaces/metadata";
import {ISubmittableResult} from "@polkadot/types/types";
import BN from "bn.js";
import React, {useEffect, useState} from 'react';
import {Trans, useTranslation} from "react-i18next";
import config from "../../config";
import {useSubstrate} from "../index";
import {ApiState, KeyringState} from "../SubstrateContext";
import ExtrinsicFailed from "./ExtrinsicFailed";
import SignAndSubmitForm from "./SignAndSubmitForm";
import SubstrateLoading from "./SubstrateLoading";
import TransactionError from "./TransactionError";
import TransactionInProgress from "./TransactionInProgress";
import {getFromAcct, transformParams} from "./utils";

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

export interface Account {
    name: string,
    address: string
}

export interface Props {
    onClose: () => void
    txAttrs: TxAttrs
    setExtrinsicDetails: (data: { extrinsicHash: string, lastBlockHash: string }) => void
}

const SubmittingTransaction: React.FC<Props> = ({children, onClose, txAttrs, setExtrinsicDetails}) => {
    const {t} = useTranslation()
    const [result, setResult] = useState<Result | undefined>()
    const [error, setError] = useState<any>()
    const [submitting, setSubmitting] = useState(false)
    const {keyringState, keyring, api, apiState} = useSubstrate();

    const [accounts, setAccounts] = useState<Account[]>([])

    useEffect(() => {
        if (keyringState === KeyringState.READY && keyring) {
            const keyringAccounts = keyring.getAccounts().map((account) => {
                return {name: account.meta?.name || '', address: account.address} as Account
            })
            setAccounts(keyringAccounts)
        }
    }, [keyring, keyringState])

    const txResHandler = (result: ISubmittableResult) => {
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
        const properties = await api.rpc.system.properties()
        const decimals = properties.tokenDecimals.unwrapOr(new BN(15)).toNumber()

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
            <Box
                display="flex"
                flexDirection='column'
                alignItems='center'
            >
                {children}
                <SignAndSubmitForm accounts={accounts} txAttrs={txAttrs} onCancel={onClose} onSubmit={onSubmit}/>
            </Box>
        )
    } else if (result && result.error) {
        return <ExtrinsicFailed error={result.error} onOk={onClose}/>
    } else if (error) {
        return <TransactionError
            error={error}
            onOk={onClose}
            title={t('substrate.error.transaction.title', {networkName: config.NETWORK_NAME})}/>
    } else {
        return <TransactionInProgress status={result?.status} event={result?.event} onOk={onClose} eventDescription={txAttrs.eventDescription}/>
    }
}

export default SubmittingTransaction
