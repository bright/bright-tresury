import { BlockchainTipDto } from '../../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { Nil } from '../../utils/types'
import { TipEntity } from '../tip.entity'
import { PublicUserDto } from '../../users/dto/public-user.dto'

export enum TipStatus {
    Proposed = 'Proposed',
    Tipped = 'Tipped',
    Closing = 'Closing',
    PendingPayout = 'PendingPayout',
    Unknown = 'Unknown',
}

export interface FindTipDto {
    blockchain: BlockchainTipDto
    entity: Nil<TipEntity>
    people: Map<string, PublicUserDto>
    status: TipStatus
}
