import { BlockchainChildBountyDto } from '../../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { ChildBountyEntity } from '../entities/child-bounty.entity'
import { Nil } from '../../../utils/types'
import { UserEntity } from '../../../users/entities/user.entity'
import { PublicUserDto } from '../../../users/dto/public-user.dto'

export class FindChildBountyDto {
    blockchain: BlockchainChildBountyDto
    entity?: Nil<ChildBountyEntity>
    curator?: Nil<PublicUserDto>
    beneficiary?: Nil<PublicUserDto>
    constructor(
        blockchain: BlockchainChildBountyDto,
        entity?: Nil<ChildBountyEntity>,
        curator?: Nil<PublicUserDto>,
        beneficiary?: Nil<PublicUserDto>,
    ) {
        this.blockchain = blockchain
        this.entity = entity
        this.curator = curator
        this.beneficiary = beneficiary
    }

    isOwner = (user: UserEntity) => this.entity?.isOwner(user) || this.blockchain.isOwner(user)
}