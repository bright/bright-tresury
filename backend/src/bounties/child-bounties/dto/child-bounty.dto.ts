import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlockchainChildBountyStatus } from '../../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { FindChildBountyDto } from './find-child-bounty.dto'
import { NetworkPlanckValue, Nil } from '../../../utils/types'
import { PublicUserDto } from '../../../users/dto/public-user.dto'
import { PolkassemblyPostDto } from '../../../polkassembly/dto/polkassembly-post.dto'
import { PolkassemblyChildBountyPostDto } from '../../../polkassembly/childBounties/childBounty-post.dto'

export class ChildBountyDto {
    @ApiProperty({
        description: 'Child bounty blockchain index',
    })
    blockchainIndex: number

    @ApiProperty({
        description: 'Parent bounty blockchain index',
    })
    parentBountyBlockchainIndex: number

    @ApiProperty({
        description: 'Bounty description stored in blockchain',
    })
    blockchainDescription: string

    @ApiProperty({
        description: 'Child bounty value',
    })
    value: NetworkPlanckValue

    @ApiProperty({
        description: 'Fee for the curator',
    })
    curatorFee: NetworkPlanckValue

    @ApiProperty({
        description: 'Account information of a person who will manage the child bounty (curator)',
    })
    curator?: Nil<PublicUserDto>

    @ApiProperty({
        description: 'Curator deposit',
    })
    curatorDeposit: NetworkPlanckValue

    @ApiProperty({
        description: 'Account information of a person who will get the child bounty reward (beneficiary)',
    })
    beneficiary?: Nil<PublicUserDto>

    @ApiProperty({
        description: 'The block number at which the payout is unlocked',
    })
    unlockAt?: Nil<string>

    @ApiProperty({
        description: 'Current child bounty status ',
    })
    status: BlockchainChildBountyStatus

    @ApiPropertyOptional({
        description: 'Public data of a user who created child bounty details',
    })
    owner?: Nil<PublicUserDto>

    @ApiPropertyOptional({
        description: 'Child bounty title stored in the Bright Treasury module',
    })
    title?: Nil<string>

    @ApiPropertyOptional({
        description: 'Child bounty description stored in the Bright Treasury module',
    })
    description?: Nil<string>

    @ApiPropertyOptional({
        description: 'Child bounty data kept in polkassembly server',
        type: PolkassemblyPostDto,
    })
    polkassembly?: Nil<PolkassemblyChildBountyPostDto>

    constructor({ blockchain, entity, curator, beneficiary, polkassembly }: FindChildBountyDto) {
        this.blockchainIndex = blockchain.index
        this.parentBountyBlockchainIndex = blockchain.parentIndex
        this.blockchainDescription = blockchain.description
        this.value = blockchain.value
        this.curatorDeposit = blockchain.curatorDeposit
        this.curatorFee = blockchain.fee
        this.unlockAt = blockchain.unlockAt
        this.status = blockchain.status

        this.owner = entity?.owner ? PublicUserDto.fromUserEntity(entity.owner) : undefined
        this.title = entity?.title
        this.description = entity?.description

        this.curator = curator
        this.beneficiary = beneficiary
        this.polkassembly = polkassembly
    }
}
