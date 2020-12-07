import {Box} from "@material-ui/core";
import {ISubmittableResult} from "@polkadot/types/types";
import {sign} from "crypto";
import React, {useEffect, useState} from 'react';
import {useSubstrate} from "../index";
import SignAndSubmitForm from "./SignAndSubmitForm";
import TransactionError from "./TransactionError";
import TransactionInProgress from "./TransactionInProgress";
import TransactionWarning from "./TransactionWarning";
import {getFromAcct, transformParams} from "./utils";

export interface Result {
    status: Status,
    event?: any,
    error?: any,
}

export interface Status {
    isReady: boolean
    isInBlock: boolean
    isFinalized: boolean
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
    setExtrinsicDetails: (data: any) => void
}

const SubmittingTransaction: React.FC<Props> = ({children, onClose, txAttrs, setExtrinsicDetails}) => {
    const [result, setTransactionResult] = useState<Result | undefined>(undefined)
    const [error, setTransactionError] = useState<any>(undefined)
    const [submitting, setSubmitting] = useState(false)
    const [unsub, setUnsub] = useState<(() => void) | undefined>(undefined);
    const {keyringState, keyring, api} = useSubstrate();

    const [accounts, setAccounts] = useState<Account[]>([])

    useEffect(() => {
        if (keyringState === 'READY' && keyring) {
            const keyringAccounts = keyring.getAccounts().map((account) => {
                return {name: account.meta?.name || '', address: account.address} as Account
            })
            setAccounts(keyringAccounts)
        }
    }, [keyring, keyringState])

    const txResHandler = (result: ISubmittableResult) => {
        const txResult = {status: result.status} as Result

        const applyExtrinsicEvents = result.events
            .filter(({phase, event}) =>
                phase.isApplyExtrinsic && event.section === txAttrs.palletRpc && event.method === txAttrs.eventMethod
            )

        if (applyExtrinsicEvents.length > 0) {
            txResult.event = applyExtrinsicEvents[0].event.meta
        }

        setTransactionResult(txResult)
    }

    const txErrHandler = (err: any) => {
        setTransactionError(err)
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

        const transformed = transformParams(inputParams);

        // transformed can be empty parameters
        const txExecute = transformed
            ? api.tx[palletRpc][callable](...transformed)
            : api.tx[palletRpc][callable]();

        // sign the transaction to get the proper extrinsic hash
        await txExecute.signAsync(fromAcct)

        const signedBlock = await api.rpc.chain.getBlock();
        setExtrinsicDetails({extrinsicHash: txExecute.hash, lastBlockHash: signedBlock.hash})

        // send the transaction
        const unsub = await txExecute.send(txResHandler)
            .catch(txErrHandler);
        setUnsub(() => unsub);
    };

    const onSubmit = async (address: string) => {
        debugger;
        setSubmitting(true)
        if (unsub !== undefined) {
            await unsub();
            setUnsub(undefined);
        }
        await signAndSend(address)
    };

    return (
        <Box
            display="flex"
            flexDirection='column'
            alignItems='center'
        >
            {!submitting && <>
                {children}
                <SignAndSubmitForm accounts={accounts} txAttrs={txAttrs} onCancel={onClose} onSubmit={onSubmit}/>
            </>}
            {result && result.error ? <TransactionWarning error={error} onOk={onClose}/> : null}
            {result && !result.error ?
                <TransactionInProgress status={result.status} event={result.event} onOk={onClose} eventDescription={txAttrs.eventDescription}/> : null}
            {error ? <TransactionError error={error} onOk={onClose}/> : null}
        </Box>)

}

export default SubmittingTransaction
