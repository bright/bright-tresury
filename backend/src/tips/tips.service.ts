import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { BlockchainTipsService } from '../blockchain/blockchain-tips/blockchain-tips.service'
import { BlockchainTipDto } from '../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { getLogger } from '../logging.module'
import { UserEntity } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { arrayToMap, keysAsArray } from '../utils/arrayToMap'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame } from '../utils/time-frame.query'
import { Nil } from '../utils/types'
import { CreateTipDto } from './dto/create-tip.dto'
import { FindTipDto } from './dto/find-tip.dto'
import { ListenForTipDto } from './dto/listen-for-tip.dto'
import { TipFilterQuery } from './tip-filter.query'
import { TipEntity } from './tip.entity'

const logger = getLogger()

@Injectable()
export class TipsService {
    constructor(
        @InjectRepository(TipEntity) private readonly repository: Repository<TipEntity>,
        private readonly blockchainTipsService: BlockchainTipsService,
        private readonly usersService: UsersService,
        private readonly extrinsicsService: ExtrinsicsService,
    ) {}

    create(dto: CreateTipDto, user: UserEntity): Promise<TipEntity> {
        logger.info(`Creating a tip entity`, dto)
        const tip = this.repository.create({
            ...dto,
            owner: user,
        })
        return this.repository.save(tip)
    }

    async listenForNewTipExtrinsic(dto: ListenForTipDto, user: UserEntity): Promise<ExtrinsicEntity> {
        logger.info(`Start listening for a new tip extrinsic...`)
        const callback = async (events: ExtrinsicEvent[]) => {
            const blockchainHash = BlockchainTipsService.extractTipHash(events)
            if (blockchainHash !== undefined) {
                logger.info(`Tip hash found ${blockchainHash}. Creating tip entity`)
                await this.create({ ...dto, blockchainHash }, user)
            }
        }
        return this.extrinsicsService.listenForExtrinsic(
            dto.networkId,
            { extrinsicHash: dto.extrinsicHash, lastBlockHash: dto.lastBlockHash, data: dto },
            callback,
        )
    }

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
        const people = await this.getMappedPublicUserDtos([
            ...blockchain.tips.map((tip) => tip.tipper),
            blockchain.finder,
            blockchain.who,
        ])

        return { blockchain, entity, people }
    }

    private async getMappedPublicUserDtos(addresses: string[]) {
        return arrayToMap(
            await Promise.all(addresses.map((address) => this.usersService.getPublicUserDataForWeb3Address(address))),
            'web3address',
        )
    }

    private async getMappedBlockchainTips(networkId: string) {
        return arrayToMap(await this.blockchainTipsService.getTips(networkId), 'hash')
    }

    private async getMappedDatabaseTips(options: FindManyOptions) {
        return arrayToMap(await this.repository.find(options), 'blockchainHash')
    }
}
