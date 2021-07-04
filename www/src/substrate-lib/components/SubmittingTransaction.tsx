import { SubmittableResult } from '@polkadot/api'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNetworks } from '../../networks/useNetworks'
import { ApiState } from '../api/SubstrateContext'
import ExtrinsicFailed from './ExtrinsicFailed'
import SignAndSubmit from './SignAndSubmit'
import SubstrateLoading from './SubstrateLoading'
import TransactionError from './TransactionError'
import TransactionInProgress from './TransactionInProgress'
import { getFromAcct, transformParams } from './utils'
import { useAccounts } from '../accounts/useAccounts'
import { KeyringState } from '../accounts/AccountsContext'
import { useSubstrate } from '../api/useSubstrate'

export interface Result {
    status: Status
    event?: any
    error?: ExtrinsicError
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

interface OwnProps {
    onClose: () => void
    onSuccess?: () => void
    txAttrs: TxAttrs
    onTransactionSigned: (data: { extrinsicHash: string; lastBlockHash: string }) => Promise<void>
    title: string
    instruction: string | JSX.Element
}

export type SubmittingTransactionProps = OwnProps

const SubmittingTransaction = ({
    onClose,
    onSuccess,
    txAttrs,
    onTransactionSigned,
    title,
    instruction,
}: SubmittingTransactionProps) => {
    const { t } = useTranslation()
    const [result, setResult] = useState<Result | undefined>()
    const [error, setError] = useState<any>()
    const [submitting, setSubmitting] = useState(false)

    const { api, apiState } = useSubstrate()

    const { keyring, keyringState, accounts } = useAccounts()
    const { network } = useNetworks()

    const txResHandler = ({ status, events, dispatchError }: SubmittableResult) => {
        const txResult = { status } as Result

        if (dispatchError) {
            if (dispatchError.isModule && api) {
                const decoded = api.registry.findMetaError(dispatchError.asModule)
                const { documentation, name, section } = decoded
                txResult.error = { section, name, description: documentation.join(' ') }
            } else {
                txResult.error = { description: dispatchError.toString() }
            }
        }

        const applyExtrinsicEvent = events.find(
            ({ phase, event }) =>
                phase.isApplyExtrinsic && event.section === txAttrs.palletRpc && event.method === txAttrs.eventMethod,
        )
        if (applyExtrinsicEvent) {
            txResult.event = applyExtrinsicEvent.event.meta
        }

        setResult(txResult)
    }

    const txErrHandler = (err: any) => {
        setError(err)
    }

    const signAndSend = async (address: string) => {
        const { palletRpc, callable, inputParams } = txAttrs
        if (api === undefined) {
            return
        }

        const fromAcct = await getFromAcct(address, api, keyring)
        if (fromAcct === undefined) {
            return
        }

        // TODO should be set as general properties
        const chainInfo = await api.registry.getChainProperties()
        const tokenDecimals = chainInfo?.tokenDecimals.unwrapOr(undefined)?.toString()
        const parsedTokenDecimals = tokenDecimals ? parseInt(tokenDecimals) : NaN
        const decimals = !isNaN(parsedTokenDecimals) ? parsedTokenDecimals : 12

        const transformed = transformParams(inputParams, decimals)

        // transformed can be empty parameters
        const txExecute = transformed ? api.tx[palletRpc][callable](...transformed) : api.tx[palletRpc][callable]()

        // sign the transaction to get the proper extrinsic hash
        await txExecute.signAsync(fromAcct)

        const signedBlock = await api.rpc.chain.getBlock()
        await onTransactionSigned({
            extrinsicHash: txExecute.hash.toString(),
            lastBlockHash: signedBlock.hash.toString(),
        })

        // send the transaction
        await txExecute.send(txResHandler).catch(txErrHandler)
    }

    const onSubmit = async (address: string) => {
        setSubmitting(true)
        await signAndSend(address)
    }

    if (apiState === ApiState.ERROR) {
        return (
            <TransactionError
                onOk={onClose}
                title={t('substrate.error.api.title')}
                subtitle={t('substrate.error.api.subtitle', { networkName: network.name })}
            />
        )
    } else if (apiState !== ApiState.READY) {
        return <SubstrateLoading onOk={onClose} />
    } else if (keyringState !== KeyringState.READY || (keyringState === KeyringState.READY && accounts.length === 0)) {
        return (
            <TransactionError
                onOk={onClose}
                title={t('substrate.error.accounts.title')}
                subtitle={
                    <Trans
                        id="modal-description"
                        i18nKey="substrate.error.accounts.subtitle"
                        components={{ a: <a href="https://polkadot.js.org/extension/" /> }}
                    />
                }
            />
        )
    } else if (!submitting) {
        return (
            <SignAndSubmit
                title={title}
                instruction={instruction}
                txAttrs={txAttrs}
                onCancel={onClose}
                onSubmit={onSubmit}
            />
        )
    } else if (result && result.error) {
        return <ExtrinsicFailed error={result.error} onOk={onClose} />
    } else if (error) {
        return (
            <TransactionError
                error={error}
                onOk={onClose}
                title={t('substrate.error.transaction.title', { networkName: network.name })}
            />
        )
    } else {
        return (
            <TransactionInProgress
                status={result?.status}
                event={result?.event}
                onOk={onSuccess ?? onClose}
                eventDescription={txAttrs.eventDescription}
            />
        )
    }
}

export default SubmittingTransaction
