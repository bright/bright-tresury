import { BlockchainTipDto } from '../../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { Nil } from '../../utils/types'
import { TipEntity } from '../tip.entity'
import { PublicUserDto } from '../../users/dto/public-user.dto'

export interface FindTipDto {
    blockchain: BlockchainTipDto
    entity: Nil<TipEntity>
    finder: PublicUserDto
    beneficiary: PublicUserDto
}
