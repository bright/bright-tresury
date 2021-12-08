import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { In, Repository } from 'typeorm'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import { BlockchainBountyDto } from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { getLogger } from '../logging.module'
import { UserEntity } from '../users/user.entity'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { ListenForBountyDto } from './dto/listen-for-bounty.dto'
import { UpdateBountyDto } from './dto/update-bounty.dto'
import { BountyEntity } from './entities/bounty.entity'
import { PolkassemblyService } from '../polkassembly/polkassembly.service'
import { PolkassemblyPostDto } from '../polkassembly/dto/polkassembly-post.dto'
import { Nil } from '../utils/types'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame } from '../utils/time-frame.query'

const logger = getLogger()

interface Bounty {
    blockchain: BlockchainBountyDto
    entity?: Nil<BountyEntity>
    polkassembly?: Nil<PolkassemblyPostDto>
}

@Injectable()
export class BountiesService {
    constructor(
        @InjectRepository(BountyEntity) private readonly repository: Repository<BountyEntity>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly bountiesBlockchainService: BlockchainBountiesService,
        @Inject(PolkassemblyService)
        private readonly polkassemblyService: PolkassemblyService,
    ) {}

    create(dto: CreateBountyDto, user: UserEntity): Promise<BountyEntity> {
        logger.info(`Creating a bounty entity for index`)
        const bounty = this.repository.create({
            ...dto,
            owner: user,
        })
        return this.repository.save(bounty)
    }

    async update(
        blockchainIndex: number,
        networkId: string,
        dto: UpdateBountyDto,
        user: UserEntity,
    ): Promise<[BlockchainBountyDto, Nil<BountyEntity>, Nil<PolkassemblyPostDto>]> {
        logger.info(`Update a bounty entity for index in network by user`, blockchainIndex, networkId, user)
        const [bountyBlockchain, bountyEntity] = await this.getBounty(networkId, blockchainIndex)

        if (!bountyEntity?.isOwner(user) && !bountyBlockchain.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this bounty')
        }

        bountyBlockchain.isEditableOrThrow()

        if (!bountyEntity) {
            try {
                // construct CreateBountyDto object and validate
                const createDto = plainToClass(CreateBountyDto, { ...dto, blockchainIndex, networkId })
                await validateOrReject(createDto)

                // create bounty with validated dto
                await this.create(createDto, user)
            } catch (e: any) {
                throw new BadRequestException(e.message)
            }
        } else {
            await this.repository.save({ ...bountyEntity, ...dto })
        }
        return await this.getBounty(networkId, blockchainIndex)
    }

    async listenForProposeBountyExtrinsic(dto: ListenForBountyDto, user: UserEntity): Promise<ExtrinsicEntity> {
        logger.info(`Start listening for a propose bounty extrinsic...`)
        const callback = async (events: ExtrinsicEvent[]) => {
            const bountyIndex = BlockchainBountiesService.extractBountyIndex(events)
            if (bountyIndex !== undefined) {
                logger.info(`Bounty index found ${bountyIndex}. Creating bounty entity`)
                await this.create({ ...dto, blockchainIndex: bountyIndex }, user)
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
        timeFrame: TimeFrame,
        paginatedParams: PaginatedParams
    ): Promise<PaginatedResponseDto<Bounty>> {
        try {
            if (timeFrame === TimeFrame.OnChain) {
                return this.findOnChain(networkId, paginatedParams)
            } else if (timeFrame === TimeFrame.History) {
                return this.findOffChain(networkId, paginatedParams)
            } else
                return PaginatedResponseDto.empty()
        } catch (error) {
            logger.error(error)
            return PaginatedResponseDto.empty()
        }
    }

    private async findOnChain(
        networkId: string,
        paginatedParams: PaginatedParams
    ): Promise<PaginatedResponseDto<Bounty>> {
        const bountiesBlockchain = await this.bountiesBlockchainService.getBounties(networkId)
        const blockchainIndexes = bountiesBlockchain
            .sort((bb1, bb2) => bb2.index - bb1.index)
            .map(bountyBlockchain => bountyBlockchain.index)
        if (!blockchainIndexes.length)
            return PaginatedResponseDto.empty()
        const paginatedBlockchainIndexes: number[] = blockchainIndexes.slice(paginatedParams.offset, paginatedParams.offset+paginatedParams.pageSize)
        const databaseBounties = await this.repository.find({where: {networkId, blockchainIndex: In(paginatedBlockchainIndexes)}})
        const bountiesPosts = await this.polkassemblyService.getBounties({
            indexes: paginatedBlockchainIndexes,
            networkId,
            onChain: true
        })
        const items = paginatedBlockchainIndexes.map(blockchainIndex => ({
            blockchain: bountiesBlockchain.find( bb => bb.index === blockchainIndex )!,
            entity: databaseBounties.find( db => db.blockchainIndex === blockchainIndex ),
            polkassembly: bountiesPosts.find( bp => bp.blockchainIndex === blockchainIndex )
        }))
        const total = bountiesBlockchain.length
        return {items, total}
    }

    private async findOffChain(
        networkId: string,
        paginatedParams: PaginatedParams
    ): Promise<PaginatedResponseDto<Bounty>> {
        const bountiesBlockchain = await this.bountiesBlockchainService.getBounties(networkId)
        const blockchainIndexes = bountiesBlockchain
            .sort((bb1, bb2) => bb2.index - bb1.index)
            .map(bountyBlockchain => bountyBlockchain.index)
        const bountiesPosts = await this.polkassemblyService.getBounties({
            indexes: blockchainIndexes,
            networkId,
            onChain: false,
            paginatedParams,
        })
        const offChainBlockchainIndexes = bountiesPosts.map(bp => bp.blockchainIndex)
        const databaseBounties = await this.repository.find({where: {networkId, blockchainIndex: In(offChainBlockchainIndexes)}})
        const items = offChainBlockchainIndexes.map(blockchainIndex => ({
            blockchain: bountiesPosts.find( bp => bp.blockchainIndex === blockchainIndex )!.asBlockchainBountyDto(),
            entity: databaseBounties.find( db => db.blockchainIndex === blockchainIndex ),
            polkassembly: bountiesPosts.find( bp => bp.blockchainIndex === blockchainIndex )
        }))
        const total = (await this.getTotalBountiesCount(networkId)) - bountiesBlockchain.length
        return {items, total}
    }
    async getBounty(
        networkId: string,
        blockchainIndex: number,
    ): Promise<[BlockchainBountyDto, Nil<BountyEntity>, Nil<PolkassemblyPostDto>]> {
        const [bountyBlockchain, bountyEntity] = await Promise.all([
            this.bountiesBlockchainService.getBounty(networkId, blockchainIndex),
            this.repository.findOne({ where: { networkId, blockchainIndex } }),
        ])
        const bountyPost = await this.polkassemblyService.getBounty(blockchainIndex, networkId)
        return [bountyBlockchain, bountyEntity, bountyPost]
    }

    getBountyMotions(networkId: string, blockchainIndex: number) {
        return this.bountiesBlockchainService.getMotions(networkId, blockchainIndex)
    }

    getTotalBountiesCount(networkId: string) {
        return this.bountiesBlockchainService.getTotalBountiesCount(networkId)
    }
}
