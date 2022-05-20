import { Injectable } from '@nestjs/common'
import { BlockchainChildBountiesService } from '../../blockchain/blockchain-child-bounties/blockchain-child-bounties.service'
import { BlockchainChildBountyDto } from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'

@Injectable()
export class ChildBountiesService {
    constructor(private readonly childBountiesBlockchainService: BlockchainChildBountiesService) {}
    async find(networkId: string) {
        return this.childBountiesBlockchainService.getAllChildBounties(networkId)
    }

    async findByBountyId(networkId: string, bountyId: number) {
        return this.childBountiesBlockchainService.getBountyChildBounties(networkId, bountyId)
    }

    async findOne(networkId: string, bountyId: number, childBountyId: number): Promise<BlockchainChildBountyDto> {
        return this.childBountiesBlockchainService.getChildBounty(networkId, { bountyId, childBountyId })
    }
}
