import { Injectable } from '@nestjs/common'
import { BlockchainChildBountiesService } from '../../blockchain/blockchain-child-bounties/blockchain-child-bounties.service'

@Injectable()
export class ChildBountiesService {
    constructor(private readonly childBountiesBlockchainService: BlockchainChildBountiesService) {}
    async find(networkId: string) {
        return this.childBountiesBlockchainService.getAllChildBounties(networkId)
    }

    async findByBountyId(networkId: string, bountyId: number) {
        return this.childBountiesBlockchainService.getBountyChildBounties(networkId, bountyId)
    }
}
