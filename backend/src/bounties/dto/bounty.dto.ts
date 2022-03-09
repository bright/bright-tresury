import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlockchainBountyStatus } from '../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BlockchainAccountInfo } from '../../blockchain/dto/blockchain-account-info.dto'
import { BlockchainTimeLeft } from '../../blockchain/dto/blockchain-time-left.dto'
import { PolkassemblyPostDto } from '../../polkassembly/dto/polkassembly-post.dto'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { FindBountyDto } from './find-bounty.dto'

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

    @ApiPropertyOptional({
        description: 'Bounty data kept in polkassembly server',
        type: PolkassemblyPostDto,
    })
    polkassembly?: Nil<PolkassemblyPostDto>

    constructor({ blockchain, entity, polkassembly }: FindBountyDto) {
        this.id = entity?.id
        this.blockchainIndex = blockchain.index
        this.blockchainDescription = blockchain.description
        this.proposer = blockchain.proposer
        this.value = blockchain.value
        this.bond = blockchain.bond
        this.curatorDeposit = blockchain.curatorDeposit
        this.curatorFee = blockchain.fee
        this.curator = blockchain.curator
        this.beneficiary = blockchain.beneficiary ?? (entity?.beneficiary ? { address: entity.beneficiary } : undefined)
        this.unlockAt = blockchain.unlockAt
        this.updateDue = blockchain.updateDue
        this.status = blockchain.status

        this.ownerId = entity?.ownerId
        this.title = entity?.title
        this.description = entity?.description
        this.field = entity?.field
        this.polkassembly = polkassembly
    }
}
