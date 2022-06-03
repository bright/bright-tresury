import { Injectable, NotFoundException } from '@nestjs/common'
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
import { FindTipDto, TipStatus } from './dto/find-tip.dto'
import { ListenForTipDto } from './dto/listen-for-tip.dto'
import { TipFilterQuery } from './tip-filter.query'
import { TipEntity } from './tip.entity'
import { BlockNumber } from '@polkadot/types/interfaces'
import { BlockchainService } from '../blockchain/blockchain.service'
import { GetTipsPosts, PolkassemblyTipsService } from '../polkassembly/tips/polkassembly-tips.service'
import { PolkassemblyTipPostDto } from '../polkassembly/tips/tip-post.dto'

const logger = getLogger()

@Injectable()
export class TipsService {
    constructor(
        @InjectRepository(TipEntity) private readonly repository: Repository<TipEntity>,
        private readonly blockchainTipsService: BlockchainTipsService,
        private readonly blockchainService: BlockchainService,
        private readonly usersService: UsersService,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly polkassemblyService: PolkassemblyTipsService,
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

    async findOne(networkId: string, blockchainHash: string): Promise<FindTipDto> {
        const onChain = await this.blockchainTipsService.getTip(networkId, blockchainHash)
        const [offChain] = await this.polkassemblyService.find({ includeHashes: [blockchainHash], networkId })

        if (!onChain && !offChain) {
            throw new NotFoundException(`Tip not found`)
        }
        const [currentBlockNumber, databaseTip] = await Promise.all([
            this.blockchainService.getCurrentBlockNumber(networkId),
            this.repository.findOne({ networkId, blockchainHash }),
        ])
        const blockchainTip = onChain ?? offChain!.asBlockchainTipDto()
        return this.createFindTipDto(blockchainTip, databaseTip, offChain, currentBlockNumber)
    }

    async find(
        networkId: string,
        { ownerId, status, timeFrame }: TipFilterQuery,
        paginatedParams: PaginatedParams,
    ): Promise<PaginatedResponseDto<FindTipDto>> {
        const owner = ownerId ? await this.usersService.findOne(ownerId) : null
        if (ownerId && !owner) {
            // if ownerId was provided but the user does not exists return empty response
            // because no proposal is assigned to not existing user
            return PaginatedResponseDto.empty()
        }
        try {
            if (timeFrame === TimeFrame.OnChain) return this.findOnChain(networkId, owner, status, paginatedParams)
            else return this.findOffChain(networkId, owner, status, paginatedParams)
        } catch (error) {
            logger.error(error)
            return PaginatedResponseDto.empty()
        }
    }

    private async findOnChain(
        networkId: string,
        owner: Nil<UserEntity>,
        status: Nil<TipStatus>,
        paginatedParams: PaginatedParams,
    ) {
        logger.info('Looking for on-chain tips', { networkId, status, owner: owner?.id })
        const blockchainTips = await this.getMappedBlockchainTips(networkId)
        if (!blockchainTips.size) return PaginatedResponseDto.empty()
        const hashes = keysAsArray(blockchainTips)
        const databaseTips = await this.getMappedDatabaseTips({ where: { blockchainHash: In(hashes), networkId } })
        const polkassemblyTips = await this.getMappedPolkassemblyTips({ networkId, includeHashes: hashes })
        const currentBlockNumber = await this.blockchainService.getCurrentBlockNumber(networkId)
        const allItems = (
            await Promise.all(
                hashes.map((hash) =>
                    this.createFindTipDto(
                        blockchainTips.get(hash)!,
                        databaseTips.get(hash),
                        polkassemblyTips.get(hash),
                        currentBlockNumber,
                    ),
                ),
            )
        )
            .filter((findTipDto) => !status || findTipDto.status === status)
            .filter((findTipDto) => !owner || findTipDto.isOwner(owner))
        return {
            items: paginatedParams.slice(allItems),
            total: allItems.length,
        }
    }

    private async findOffChain(
        networkId: string,
        owner: Nil<UserEntity>,
        status: Nil<TipStatus>,
        paginatedParams: PaginatedParams,
    ) {
        logger.info('Looking for off-chain tips', { networkId, owner: owner?.id })
        const blockchainTips = await this.getMappedBlockchainTips(networkId)

        const excludeHashes = keysAsArray(blockchainTips)
        const finderAddresses = this.encodeUserWeb3Addresses(networkId, owner)
        const polkassemblySearchOptions = { networkId, excludeHashes, includeHashes: null, finderAddresses }
        const [polkassemblyTipsPosts, total] = await Promise.all([
            this.getMappedPolkassemblyTips({ ...polkassemblySearchOptions, paginatedParams }),
            this.polkassemblyService.count(polkassemblySearchOptions),
        ])

        const offChainBlockchainHashes = keysAsArray(polkassemblyTipsPosts)

        const databaseTips = await this.getMappedDatabaseTips({
            where: { networkId, blockchainHash: In(offChainBlockchainHashes) },
        })
        const currentBlockNumber = await this.blockchainService.getCurrentBlockNumber(networkId)

        const items = await Promise.all(
            offChainBlockchainHashes.map((blockchainHash) =>
                this.createFindTipDto(
                    polkassemblyTipsPosts.get(blockchainHash)!.asBlockchainTipDto(),
                    databaseTips.get(blockchainHash),
                    polkassemblyTipsPosts.get(blockchainHash),
                    currentBlockNumber,
                ),
            ),
        )

        return { items, total }
    }
    private async createFindTipDto(
        blockchain: BlockchainTipDto,
        entity: Nil<TipEntity>,
        polkassembly: Nil<PolkassemblyTipPostDto>,
        currentBlockNumber: BlockNumber,
    ): Promise<FindTipDto> {
        const tippers = blockchain.tips ?? []
        const people = await this.getMappedPublicUserDtos([
            ...tippers.map((tip) => tip.tipper),
            blockchain.finder,
            blockchain.who,
        ])
        const status = TipsService.getTipStatus(blockchain, currentBlockNumber)
        return new FindTipDto(blockchain, entity, polkassembly, people, status)
    }

    private static getTipStatus({ closes, tips }: BlockchainTipDto, currentBlockNumber: BlockNumber): TipStatus {
        if (closes && closes.cmp(currentBlockNumber) !== 1) return TipStatus.PendingPayout
        else if (closes) return TipStatus.Closing
        else if (tips && tips.length !== 0) return TipStatus.Tipped
        else return TipStatus.Proposed
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

    private async getMappedPolkassemblyTips(options: GetTipsPosts): Promise<Map<number, PolkassemblyTipPostDto>> {
        return arrayToMap(await this.polkassemblyService.find(options), 'hash')
    }

    private encodeUserWeb3Addresses(networkId: string, user: Nil<UserEntity>) {
        if (!user || !user.web3Addresses) return null
        return user.web3Addresses.map((w3address) => this.blockchainService.encodeAddress(networkId, w3address.address))
    }
}
