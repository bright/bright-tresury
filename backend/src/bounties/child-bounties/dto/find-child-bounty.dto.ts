import { BlockchainChildBountyDto } from '../../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { ChildBountyEntity } from '../entities/child-bounty.entity'
import { Nil } from '../../../utils/types'
import { UserEntity } from '../../../users/entities/user.entity'
import { PublicUserDto } from '../../../users/dto/public-user.dto'
import { PolkassemblyChildBountyPostDto } from '../../../polkassembly/childBounties/childBounty-post.dto'

export class FindChildBountyDto {
    blockchain: BlockchainChildBountyDto
    polkassembly: Nil<PolkassemblyChildBountyPostDto>
    entity?: Nil<ChildBountyEntity>
    curator?: Nil<PublicUserDto>
    beneficiary?: Nil<PublicUserDto>
    constructor(
        blockchain: BlockchainChildBountyDto,
        polkassembly: Nil<PolkassemblyChildBountyPostDto>,
        entity?: Nil<ChildBountyEntity>,
        curator?: Nil<PublicUserDto>,
        beneficiary?: Nil<PublicUserDto>,
    ) {
        this.blockchain = blockchain
        this.polkassembly = polkassembly
        this.entity = entity
        this.curator = curator
        this.beneficiary = beneficiary
    }

    isOwner = (user: UserEntity) => this.entity?.isOwner(user) || this.blockchain.isOwner(user)
}
