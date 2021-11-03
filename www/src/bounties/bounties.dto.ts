import { NetworkPlanckValue, Nil } from '../util/types'

export interface BountyDto {
    id: string
    blockchainIndex: number
    blockchainSubject: string
    value: NetworkPlanckValue
    deposit: string
    subject: string
    field: string
    reason: string
    proposer: string
}

export interface CreateBountyDto {
    blockchainDescription: string
    value: NetworkPlanckValue
    title: string
    field?: Nil<string>
    description?: Nil<string>
    networkId: string
    proposer: string
    extrinsicHash: string
    lastBlockHash: string
}

export interface BountyExtrinsicDto {
    data: CreateBountyDto
    extrinsicHash: string
    lastBlockHash: string
}
