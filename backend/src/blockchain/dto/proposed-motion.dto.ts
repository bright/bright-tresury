import { ApiProperty } from '@nestjs/swagger'
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types'
import { Vec } from '@polkadot/types'
import { AccountId, BlockNumber } from '@polkadot/types/interfaces/runtime'
import { MotionTimeDto } from './motion-time.dto'
import { MotionDto, MotionMethod, MotionStatus } from './motion.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'

export class ProposedMotionDto extends MotionDto {
    @ApiProperty({ description: 'Status of the motion', type: MotionStatus.Proposed })
    status: MotionStatus.Proposed

    @ApiProperty({ description: 'List of accounts that voted aye', type: [PublicUserDto] })
    ayes: PublicUserDto[]

    @ApiProperty({ description: 'List of accounts that voted nay', type: [PublicUserDto] })
    nays: PublicUserDto[]

    constructor({ hash, method, ayes, nays, motionIndex, threshold, motionEnd }: Omit<ProposedMotionDto, 'status'>) {
        super()
        this.status = MotionStatus.Proposed
        this.hash = hash
        this.method = method
        this.ayes = ayes
        this.nays = nays
        this.motionIndex = motionIndex
        this.threshold = threshold
        this.motionEnd = motionEnd
    }
}

export function toBlockchainMotion(
    council: DeriveCollectiveProposal,
    toBlockchainMotionEnd: (endBlock: BlockNumber) => MotionTimeDto,
): ProposedMotionDto | undefined {
    const toStringVotesArray = (votesVector: Vec<AccountId>): string[] =>
        votesVector.toArray().map((accountId) => accountId.toHuman())
    const { hash, proposal, votes } = council
    if (!proposal) return
    if (votes === null) {
        return new ProposedMotionDto({
            hash: hash.toString(),
            method: proposal.method as MotionMethod,
            ayes: [],
            nays: [],
            motionIndex: null,
            threshold: null,
            motionEnd: null,
        })
    }
    return new ProposedMotionDto({
        hash: hash.toString(),
        method: proposal.method as MotionMethod,
        ayes: toStringVotesArray(votes.ayes).map((address) => new PublicUserDto({ web3address: address })),
        nays: toStringVotesArray(votes.nays).map((address) => new PublicUserDto({ web3address: address })),
        motionIndex: votes.index.toNumber(),
        threshold: votes.threshold.toNumber(),
        motionEnd: toBlockchainMotionEnd(votes.end),
    })
}
