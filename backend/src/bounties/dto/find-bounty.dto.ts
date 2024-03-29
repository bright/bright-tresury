import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { Nil } from '../../utils/types'
import { BountyEntity } from '../entities/bounty.entity'
import { PolkassemblyPostDto } from '../../polkassembly/dto/polkassembly-post.dto'
import { PolkassemblyBountyPostDto } from '../../polkassembly/bounties/bounty-post.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'
import { ChildBountyDto } from '../child-bounties/dto/child-bounty.dto'

export class FindBountyDto {
    blockchain: BlockchainBountyDto
    entity: Nil<BountyEntity>
    polkassembly: Nil<PolkassemblyPostDto>
    proposer: PublicUserDto
    curator: Nil<PublicUserDto>
    beneficiary: Nil<PublicUserDto>
    childBountiesCount: number

    constructor(
        blockchain: BlockchainBountyDto,
        entity: Nil<BountyEntity>,
        polkassembly: Nil<PolkassemblyBountyPostDto>,
        proposer: PublicUserDto,
        curator: Nil<PublicUserDto>,
        beneficiary: Nil<PublicUserDto>,
        childBountiesCount: number,
    ) {
        this.blockchain = blockchain
        this.entity = entity
        this.polkassembly = polkassembly
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.curator = curator
        this.childBountiesCount = childBountiesCount
    }

    isOwner = (user: UserEntity) => this.entity?.isOwner(user) || this.blockchain.isOwner(user)

    hasStatus = (status: BlockchainBountyStatus) => status === this.blockchain.status
}
