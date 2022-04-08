import { PublicUserDto } from '../../users/dto/public-user.dto'
import { NetworkPlanckValue, Nil } from '../../utils/types'
import { FindTipDto } from './find-tip.dto'
import { ApiProperty } from '@nestjs/swagger'

export class TipDto {
    @ApiProperty({ description: 'Tip blockchain hash' })
    hash: string
    @ApiProperty({ description: 'Tip blockchain reason' })
    reason: Nil<string>
    @ApiProperty({ description: 'Account information of a person who propose the tip', type: PublicUserDto })
    finder: PublicUserDto
    @ApiProperty({ description: 'Account information of a person who will get the tip', type: PublicUserDto })
    beneficiary: PublicUserDto
    @ApiProperty({ description: 'List of people who propose the tip amount' })
    tips: {
        tipper: PublicUserDto
        value: NetworkPlanckValue
    }[]
    @ApiProperty({ description: 'Amount of people who already proposed the tip amount' })
    tippersCount: number
    @ApiProperty({ description: '' })
    findersFee: boolean

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
    polkassembly?: Nil<{ title: string }>

    constructor({ blockchain, entity }: FindTipDto) {
        this.hash = blockchain.hash
        this.reason = blockchain.reason
        this.finder = new PublicUserDto({ web3address: blockchain.finder })
        this.beneficiary = new PublicUserDto({ web3address: blockchain.who })
        ;(this.tips = blockchain.tips.map(({ tipper, value }) => ({
            tipper: new PublicUserDto({ web3address: tipper }),
            value,
        }))),
            (this.tippersCount = blockchain.tips.length)
        this.findersFee = blockchain.findersFee

        ;(this.title = entity?.title),
            (this.description = entity?.description),
            (this.owner = PublicUserDto.fromUserEntity(entity?.owner))
    }
}
