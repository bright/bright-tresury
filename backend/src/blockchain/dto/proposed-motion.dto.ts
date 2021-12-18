import { ApiProperty } from '@nestjs/swagger'
import { DeriveAccountRegistration, DeriveCollectiveProposal } from '@polkadot/api-derive/types'
import { Vec } from '@polkadot/types'
import { AccountId, BlockNumber } from '@polkadot/types/interfaces/runtime'
import { BlockchainAccountInfo, toBlockchainAccountInfo } from './blockchain-account-info.dto'
import { MotionTimeDto } from './motion-time.dto'
import { MotionDto, MotionMethod, MotionStatus } from './motion.dto'

export class ProposedMotionDto extends MotionDto {
    @ApiProperty({ description: 'Status of the motion', type: MotionStatus.Proposed })
    status: MotionStatus.Proposed

    @ApiProperty({ description: 'List of accounts that voted aye', type: [BlockchainAccountInfo] })
    ayes: BlockchainAccountInfo[]

    @ApiProperty({ description: 'List of accounts that voted nay', type: [BlockchainAccountInfo] })
    nays: BlockchainAccountInfo[]

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
    identities: Map<string, DeriveAccountRegistration>,
    toBlockchainMotionEnd: (endBlock: BlockNumber) => MotionTimeDto,
): ProposedMotionDto {
    const toStringVotesArray = (votesVector: Vec<AccountId>): string[] =>
        votesVector.toArray().map((accountId) => accountId.toHuman())
    const { hash, proposal, votes } = council
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
        ayes: toStringVotesArray(votes.ayes).map((address) =>
            toBlockchainAccountInfo(address, identities.get(address)),
        ),
        nays: toStringVotesArray(votes.nays).map((address) =>
            toBlockchainAccountInfo(address, identities.get(address)),
        ),
        motionIndex: votes.index.toNumber(),
        threshold: votes.threshold.toNumber(),
        motionEnd: toBlockchainMotionEnd(votes.end),
    })
}
