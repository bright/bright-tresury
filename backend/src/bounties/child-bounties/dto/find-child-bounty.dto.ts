import { BlockchainChildBountyDto } from '../../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { ChildBountyEntity } from '../entities/child-bounty.entity'
import { Nil } from '../../../utils/types'

export class FindChildBountyDto {
    blockchain: BlockchainChildBountyDto
    entity?: Nil<ChildBountyEntity>

    constructor(blockchain: BlockchainChildBountyDto, entity?: Nil<ChildBountyEntity>) {
        this.blockchain = blockchain
        this.entity = entity
    }
}
