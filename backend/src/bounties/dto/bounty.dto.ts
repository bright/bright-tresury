import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlockchainBountyStatus } from '../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BlockchainTimeLeft } from '../../blockchain/dto/blockchain-time-left.dto'
import { PolkassemblyPostDto } from '../../polkassembly/dto/polkassembly-post.dto'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { FindBountyDto } from './find-bounty.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'
import { BlockchainChildBountyDto } from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { ChildBountyDto } from '../child-bounties/dto/child-bounty.dto'

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
    proposer: PublicUserDto

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
    curator?: Nil<PublicUserDto>

    @ApiProperty({
        description: 'Account information of a person who will get the bounty reward (beneficiary)',
    })
    beneficiary?: Nil<PublicUserDto>

    @ApiProperty({
        description: 'Time left until the payout is unlocked',
    })
    unlockAt?: BlockchainTimeLeft

    @ApiProperty({
        description: 'An update from the curator is due by this block, else they are considered inactive',
    })
    updateDue?: Nil<string>

    @ApiProperty({
        description: 'Current bounty status ',
    })
    status: BlockchainBountyStatus

    @ApiPropertyOptional({
        description: 'Public data of a user who created bounty details',
    })
    owner?: Nil<PublicUserDto>

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

    @ApiProperty({
        description: 'Child bounties count assigned to this bounty',
    })
    childBountiesCount: number

    @ApiPropertyOptional({
        description: 'Bounty data kept in polkassembly server',
        type: PolkassemblyPostDto,
    })
    polkassembly?: Nil<PolkassemblyPostDto>

    constructor({
        blockchain,
        entity,
        polkassembly,
        beneficiary,
        curator,
        proposer,
        childBountiesCount,
    }: FindBountyDto) {
        this.id = entity?.id
        this.blockchainIndex = blockchain.index
        this.blockchainDescription = blockchain.description
        this.proposer = proposer
        this.value = blockchain.value
        this.bond = blockchain.bond
        this.curatorDeposit = blockchain.curatorDeposit
        this.curatorFee = blockchain.fee
        this.curator = curator
        this.beneficiary = beneficiary
        this.unlockAt = blockchain.unlockAt
        this.updateDue = blockchain.updateDue?.toString()
        this.status = blockchain.status
        this.owner = entity?.owner ? PublicUserDto.fromUserEntity(entity.owner) : null
        this.title = entity?.title
        this.description = entity?.description
        this.field = entity?.field
        this.childBountiesCount = childBountiesCount
        this.polkassembly = polkassembly
    }
}
