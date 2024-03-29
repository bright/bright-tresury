import { BlockchainTipDto } from '../../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { Nil } from '../../utils/types'
import { TipEntity } from '../tip.entity'
import { PublicUserDto } from '../../users/dto/public-user.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { PolkassemblyTipPostDto } from '../../polkassembly/tips/tip-post.dto'

export enum TipStatus {
    Proposed = 'Proposed',
    Tipped = 'Tipped',
    Closing = 'Closing',
    PendingPayout = 'PendingPayout',
}

export class FindTipDto {
    blockchain: BlockchainTipDto
    entity: Nil<TipEntity>
    polkassembly: Nil<PolkassemblyTipPostDto>
    people: Map<string, PublicUserDto>
    status: TipStatus

    constructor(
        blockchain: BlockchainTipDto,
        entity: Nil<TipEntity>,
        polkassembly: Nil<PolkassemblyTipPostDto>,
        people: Map<string, PublicUserDto>,
        status: TipStatus,
    ) {
        this.blockchain = blockchain
        this.entity = entity
        this.polkassembly = polkassembly
        this.people = people
        this.status = status
    }

    isOwner = (user: UserEntity) => this.entity?.isOwner(user) || this.blockchain.isOwner(user)
}
