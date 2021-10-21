import BN from 'bn.js'
import { Vec } from '@polkadot/types'
import { AccountId } from '@polkadot/types/interfaces/runtime'
import { DeriveCollectiveProposal, DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { BadRequestException } from '@nestjs/common'
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
