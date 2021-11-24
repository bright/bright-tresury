import { NetworkPlanckValue, Nil } from '../../utils/types'
import { BlockchainAccountInfo } from '../../blockchain/dto/blockchain-account-info.dto'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BountyEntity } from '../entities/bounty.entity'
import { BlockchainTimeLeft } from '../../blockchain/dto/blockchain-time-left.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BountyDto {
    @ApiProperty({
        description: 'Bounty id used by Bright Treasury',
    })
    id?: Nil<string>

    @ApiProperty({
        description: 'Bounty id used by blockchain',
    })
    blockchainIndex: number

    @ApiProperty({
        description: 'Bounty description stored in blockchain',
    })
    blockchainDescription: string

    @ApiProperty({
        description: 'Account information of a person who proposed the bounty',
    })
    proposer: BlockchainAccountInfo

    @ApiProperty({
        description: 'Bounty value',
    })
    value: NetworkPlanckValue

    @ApiProperty({
        description: 'Amount reserved from the proposer account, returned on approval or slashed upon rejection',
    })
    bond: NetworkPlanckValue

    @ApiProperty({
        description: 'Curator deposit',
    })
    curatorDeposit: NetworkPlanckValue

    @ApiProperty({
        description: 'Fee for the curator',
    })
    curatorFee: NetworkPlanckValue

    @ApiProperty({
        description: 'Account information of a person who will manage the bounty (curator)',
    })
    curator?: BlockchainAccountInfo

    @ApiProperty({
        description: 'Account information of a person who will get the bounty reward (beneficiary)',
    })
    beneficiary?: BlockchainAccountInfo

    @ApiProperty({
        description: 'Time left until the payout is unlocked',
    })
    unlockAt?: BlockchainTimeLeft

    @ApiProperty({
        description: 'Time left until the bounty expires',
    })
    updateDue?: BlockchainTimeLeft

    @ApiProperty({
        description: 'Current bounty status ',
    })
    status: BlockchainBountyStatus

    @ApiPropertyOptional({
        description: 'Id of a user who created bounty details',
    })
    ownerId?: Nil<string>

    @ApiPropertyOptional({
        description: 'Bounty title stored in the Bright Treasury module',
    })
    title?: Nil<string>

    @ApiPropertyOptional({
        description: 'Bounty field stored in the Bright Treasury module',
    })
    field?: Nil<string>

    @ApiPropertyOptional({
        description: 'Bounty description stored in the Bright Treasury module',
    })
    description?: Nil<string>

    constructor(bountyBlockchain: BlockchainBountyDto, bountyEntity?: BountyEntity) {
        this.id = bountyEntity?.id
        this.blockchainIndex = bountyBlockchain.index
        this.blockchainDescription = bountyBlockchain.description
        this.proposer = bountyBlockchain.proposer
        this.value = bountyBlockchain.value
        this.bond = bountyBlockchain.bond
        this.curatorDeposit = bountyBlockchain.curatorDeposit
        this.curatorFee = bountyBlockchain.fee
        this.curator = bountyBlockchain.curator
        this.beneficiary =
            bountyBlockchain.beneficiary ??
            (bountyEntity?.beneficiary ? { address: bountyEntity.beneficiary } : undefined)
        this.unlockAt = bountyBlockchain.unlockAt
        this.updateDue = bountyBlockchain.updateDue
        this.status = bountyBlockchain.status

        this.ownerId = bountyEntity?.ownerId
        this.title = bountyEntity?.title
        this.description = bountyEntity?.description
        this.field = bountyEntity?.field
    }
}
