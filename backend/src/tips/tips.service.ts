import { Injectable } from '@nestjs/common'
import { TipFilterQuery } from './tip-filter.query'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { TimeFrame } from '../utils/time-frame.query'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { getLogger } from '../logging.module'
import { arrayToMap, keysAsArray } from '../utils/arrayToMap'
import { BlockchainTipsService } from '../blockchain/blockchain-tips/blockchain-tips.service'
import { FindTipDto } from './dtos/find-tip.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { TipEntity } from './tip.entity'
import { In, Repository } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { UsersService } from '../users/users.service'
import { BlockchainTipDto } from '../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { Nil } from '../utils/types'

const logger = getLogger()

@Injectable()
export class TipsService {
    constructor(
        @InjectRepository(TipEntity) private readonly repository: Repository<TipEntity>,
        private readonly blockchainTipsService: BlockchainTipsService,
        private readonly usersService: UsersService,
    ) {}

    async find(
        networkId: string,
        { timeFrame }: TipFilterQuery,
        paginatedParams: PaginatedParams,
    ): Promise<PaginatedResponseDto<FindTipDto>> {
        try {
            if (timeFrame === TimeFrame.OnChain) return this.findOnChain(networkId, paginatedParams)
            else return this.findOffChain(networkId, paginatedParams)
        } catch (error) {
            logger.error(error)
            return PaginatedResponseDto.empty()
        }
    }

    private async findOnChain(networkId: string, paginatedParams: PaginatedParams) {
        const blockchainTips = await this.getMappedBlockchainTips(networkId)
        if (!blockchainTips.size) return PaginatedResponseDto.empty()
        const hashes = keysAsArray(blockchainTips)
        const databaseTips = await this.getMappedDatabaseTips({ where: { blockchainHash: In(hashes), networkId } })
        const polkassemblyTips = {} // TODO: TREAS-446 add when implementing polkassembly support
        const allItems = await Promise.all(
            hashes.map((hash) => this.createFindTipDto(blockchainTips.get(hash)!, databaseTips.get(hash))),
        )
        return {
            items: paginatedParams.slice(allItems),
            total: allItems.length,
        }
    }

    private findOffChain(networkId: any, paginatedParams: PaginatedParams) {
        // TODO: TREAS-453 Implement  history tips
        return Promise.resolve({ items: [], total: 0 })
    }
    private async createFindTipDto(blockchain: BlockchainTipDto, entity: Nil<TipEntity>): Promise<FindTipDto> {
        const finderAddress = blockchain.finder
        const beneficiaryAddress = blockchain.who
        const [finder, beneficiary] = await Promise.all([
            this.usersService.getPublicUserDataForWeb3Address(finderAddress),
            this.usersService.getPublicUserDataForWeb3Address(beneficiaryAddress),
        ])
        return { blockchain, entity, finder: finder!, beneficiary: beneficiary! }
    }
    private async getMappedBlockchainTips(networkId: string) {
        return arrayToMap(await this.blockchainTipsService.getTips(networkId), 'hash')
    }
    private async getMappedDatabaseTips(options: FindManyOptions) {
        return arrayToMap(await this.repository.find(options), 'blockchainHash')
    }
}
