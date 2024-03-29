import { PublicUserDto } from '../../users/dto/public-user.dto'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { FindTipDto, TipStatus } from './find-tip.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PolkassemblyPostDto } from '../../polkassembly/dto/polkassembly-post.dto'

export class TipDto {
    @ApiProperty({ description: 'Tip blockchain hash' })
    hash: string
    @ApiProperty({ description: 'Tip blockchain reason' })
    reason: Nil<string>
    @ApiProperty({ description: 'The account who began this tip', type: PublicUserDto })
    finder: PublicUserDto
    @ApiProperty({ description: 'The account to be tipped', type: PublicUserDto })
    beneficiary: PublicUserDto
    @ApiPropertyOptional({ description: 'The members who have voted for this tip' })
    tips: Nil<
        {
            tipper: PublicUserDto
            value: NetworkPlanckValue
        }[]
    >
    @ApiProperty({ description: 'Whether this tip should result in the finder taking a fee' })
    findersFee: boolean
    @ApiProperty({ description: 'The amount held on deposit for this tip' })
    deposit: NetworkPlanckValue
    @ApiProperty({
        description: 'The block number at which this tip will close. If undefined, then no closing is scheduled',
    })
    closes: Nil<string>

    @ApiProperty({ description: 'Tip title stored by BrightTreasury' })
    title: Nil<string>
    @ApiProperty({ description: 'Tip description stored by BrightTreasury' })
    description: Nil<string>
    @ApiProperty({
        description: 'Account information of a person who created the tip in BrightTreasury',
        type: PublicUserDto,
    })
    owner: Nil<PublicUserDto>

    @ApiProperty({ description: 'Polkassembly tip information' })
    polkassembly?: Nil<PolkassemblyPostDto>

    @ApiProperty({ description: 'Tip status', enum: TipStatus })
    status!: TipStatus

    constructor({ blockchain, entity, polkassembly, people, status }: FindTipDto) {
        this.hash = blockchain.hash
        this.reason = blockchain.reason
        this.finder = people.get(blockchain.finder) ?? new PublicUserDto({ web3address: blockchain.finder })
        this.beneficiary = people.get(blockchain.who) ?? new PublicUserDto({ web3address: blockchain.who })
        this.tips = blockchain.tips
            ? blockchain.tips.map(({ tipper, value }) => ({
                  tipper: people.get(tipper) ?? new PublicUserDto({ web3address: tipper }),
                  value,
              }))
            : null
        this.findersFee = blockchain.findersFee
        this.deposit = blockchain.deposit
        this.closes = blockchain.closes?.toString()

        this.title = entity?.title
        this.description = entity?.description
        this.owner = PublicUserDto.fromUserEntity(entity?.owner)

        this.polkassembly = polkassembly

        this.status = status
    }
}
