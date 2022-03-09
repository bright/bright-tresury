import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { Nil } from '../../utils/types'
import { BountyEntity } from '../entities/bounty.entity'
import { PolkassemblyPostDto } from '../../polkassembly/dto/polkassembly-post.dto'
import { PolkassemblyBountyPostDto } from '../../polkassembly/dto/bounty-post.dto'
import { UserEntity } from '../../users/user.entity'

export class FindBountyDto {
    blockchain: BlockchainBountyDto
    entity?: Nil<BountyEntity>
    polkassembly?: Nil<PolkassemblyPostDto>

    constructor(
        blockchain: BlockchainBountyDto,
        entity?: Nil<BountyEntity>,
        polkassembly?: Nil<PolkassemblyBountyPostDto>,
    ) {
        this.blockchain = blockchain
        this.entity = entity
        this.polkassembly = polkassembly
    }

    isOwner = (user: UserEntity) => this.entity?.isOwner(user) || this.blockchain.isOwner(user)

    hasStatus = (status: BlockchainBountyStatus) => status === this.blockchain.status
}
