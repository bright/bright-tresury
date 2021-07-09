import { Injectable } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { StatsDto } from './stats.dto'

@Injectable()
export class StatsService {
    constructor(private readonly blockchainService: BlockchainService) {}

    async getStats(networkName: string): Promise<StatsDto> {
        return await this.blockchainService.getStats(networkName)
    }
}