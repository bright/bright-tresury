import { BlockchainAccountInfo, toBlockchainAccountInfo } from './blockchain-account-info.dto'
import { BlockchainProposalMotionEnd } from './blockchain-proposal-motion-end.dto'
import { DeriveAccountRegistration, DeriveCollectiveProposal } from '@polkadot/api-derive/types'
import { AccountId, BlockNumber } from '@polkadot/types/interfaces/runtime'
import { Nil } from '../../utils/types'
import { Vec } from '@polkadot/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BlockchainProposalMotion {
    @ApiProperty({ description: 'Hash of the motion' })
    hash: string
    @ApiProperty({ description: 'Either approveProposal or rejectProposal' })
    method: string
    @ApiPropertyOptional({ description: 'List of accounts that voted aye', type: [BlockchainAccountInfo] })
    ayes: Nil<BlockchainAccountInfo[]>
    @ApiPropertyOptional({ description: 'List of accounts that voted nay', type: [BlockchainAccountInfo] })
    nays: Nil<BlockchainAccountInfo[]>
    @ApiPropertyOptional({ description: 'Index of this motion', type: Number })
    motionIndex: Nil<number>
    @ApiPropertyOptional({
        description: 'Threshold after which the motion will be either approve or rejected',
        type: Number,
    })
    threshold: Nil<number>
    @ApiPropertyOptional({ description: 'Motion end information', type: BlockchainProposalMotionEnd })
    end: Nil<BlockchainProposalMotionEnd>

    constructor({ hash, method, ayes, nays, motionIndex, threshold, end }: BlockchainProposalMotion) {
        this.hash = hash
        this.method = method
        this.ayes = ayes
        this.nays = nays
        this.motionIndex = motionIndex
        this.threshold = threshold
        this.end = end
    }
}

export function toBlockchainProposalMotion(
    council: DeriveCollectiveProposal,
    identities: Map<string, DeriveAccountRegistration>,
    toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => BlockchainProposalMotionEnd,
): BlockchainProposalMotion {
    const toStringVotesArray = (votesVector: Vec<AccountId>): string[] =>
        votesVector.toArray().map((accountId) => accountId.toHuman())
    const { hash, proposal, votes } = council
    if (votes === null) {
        return new BlockchainProposalMotion({
            hash: hash.toString(),
            method: proposal.method,
            ayes: null,
            nays: null,
            motionIndex: null,
            threshold: null,
            end: null,
        })
    }
    return new BlockchainProposalMotion({
        hash: hash.toString(),
        method: proposal.method,
        ayes: toStringVotesArray(votes.ayes).map((address) =>
            toBlockchainAccountInfo(address, identities.get(address)),
        ),
        nays: toStringVotesArray(votes.nays).map((address) =>
            toBlockchainAccountInfo(address, identities.get(address)),
        ),
        motionIndex: votes.index.toNumber(),
        threshold: votes.threshold.toNumber(),
        end: toBlockchainProposalMotionEnd(votes.end),
    })
}
