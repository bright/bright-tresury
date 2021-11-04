import BN from 'bn.js'
import { Vec } from '@polkadot/types'
import { AccountId } from '@polkadot/types/interfaces/runtime'
import { DeriveCollectiveProposal, DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { BadRequestException } from '@nestjs/common'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { getLogger } from '../logging.module'
import { BlockchainsConnections } from './blockchain.module'
import { ApiPromise } from '@polkadot/api'

export const BN_TEN = new BN(10)

export const vecToArray = (vec: Vec<AccountId> | undefined): AccountId[] => vec?.toArray() || []

const getVotersFromCouncil = (council: DeriveCollectiveProposal[]) =>
    council.reduce(
        (motionVoters, { votes }) => [...motionVoters, ...vecToArray(votes?.nays), ...vecToArray(votes?.ayes)],
        [] as AccountId[],
    )

export const getVoters = (deriveTreasuryProposals: DeriveTreasuryProposal[]): AccountId[] =>
    deriveTreasuryProposals.reduce(
        (proposalVoters, { council }) => [...proposalVoters, ...getVotersFromCouncil(council)],
        [] as AccountId[],
    )

export const getProposers = (deriveTreasuryProposals: DeriveTreasuryProposal[]): AccountId[] =>
    deriveTreasuryProposals.map(({ proposal }) => proposal.proposer)

export const getBeneficiaries = (deriveTreasuryProposals: DeriveTreasuryProposal[]): AccountId[] =>
    deriveTreasuryProposals.map(({ proposal }) => proposal.beneficiary)

export const transformBalance = (balance: string | BN, decimals: number, base: number | 'hex' = 'hex'): number => {
    if (typeof balance === 'string') {
        balance = new BN(balance, base)
    }
    const decimalsBN = BN_TEN.pow(new BN(decimals))
    const fractionalPart = balance.mod(decimalsBN).toNumber() / Math.pow(10, decimals)
    const integerPart = balance.div(decimalsBN).toNumber()

    return integerPart + fractionalPart
}

export const getApi = (connections: BlockchainsConnections, networkId: string): ApiPromise => {
    if (!connections[networkId]) throw new BadRequestException(`Unrecognized network id: ${networkId}`)

    return connections[networkId].apiPromise
}

export function extractFromBlockchainEvent(
    extrinsicEvents: ExtrinsicEvent[],
    sectionName: string,
    methodName: string,
    argName: string,
): string | undefined {
    getLogger().info(
        `Extracting event from extrinsicEvents with section: ${sectionName}, method: ${methodName}, arg name: ${argName}`,
    )
    const event = extrinsicEvents.find(({ section, method }) => section === sectionName && method === methodName)

    if (!event) {
        getLogger().info(`Event not found for section: ${sectionName}, method: ${methodName}`)
        return
    }

    const value = event.data.find(({ name }) => name === argName)?.value
    getLogger().info(
        `Event found for section: ${sectionName}, method: ${methodName}. The value for arg name: ${argName} is: ${value}`,
    )
    return value
}

export function extractNumberFromBlockchainEvent(
    extrinsicEvents: ExtrinsicEvent[],
    sectionName: string,
    methodName: string,
    argName: string,
): number | undefined {
    const value = extractFromBlockchainEvent(extrinsicEvents, sectionName, methodName, argName)
    const numberValue = Number(value)

    if (!isNaN(numberValue)) {
        return numberValue
    }

    if (value !== undefined && isNaN(numberValue)) {
        getLogger().info(
            `Found value ${value} is not a number for section: ${sectionName}, method: ${methodName}, arg name: ${argName}`,
        )
    }
}
