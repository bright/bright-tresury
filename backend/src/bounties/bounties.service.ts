import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { In, Repository } from 'typeorm'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { ProposedMotionDto } from '../blockchain/dto/proposed-motion.dto'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { getLogger } from '../logging.module'
import { PolkassemblyBountiesService } from '../polkassembly/bounties/polkassembly-bounties.service'
import { ExecutedMotionDto } from '../polkassembly/dto/executed-motion.dto'
import { UserEntity } from '../users/entities/user.entity'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { ListenForBountyDto } from './dto/listen-for-bounty.dto'
import { UpdateBountyDto } from './dto/update-bounty.dto'
import { BountyEntity } from './entities/bounty.entity'
import { GetPosts } from '../polkassembly/polkassembly.service'
import { Nil } from '../utils/types'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame } from '../utils/time-frame.query'
import { UsersService } from '../users/users.service'
import { BountyFilterQuery } from './bounty-filter.query'
import { arrayToMap, keysAsArray } from '../utils/arrayToMap'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { FindBountyDto } from './dto/find-bounty.dto'
import { BlockchainService } from '../blockchain/blockchain.service'
import { PolkassemblyBountyPostDto } from '../polkassembly/bounties/bounty-post.dto'
import { ChildBountiesService } from './child-bounties/child-bounties.service'
import { PublicUserDto } from '../users/dto/public-user.dto'

const logger = getLogger()

@Injectable()
export class BountiesService {
    constructor(
        @InjectRepository(BountyEntity) private readonly repository: Repository<BountyEntity>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly bountiesBlockchainService: BlockchainBountiesService,
        private readonly childBountiesService: ChildBountiesService,
        private readonly blockchainService: BlockchainService,
        private readonly polkassemblyService: PolkassemblyBountiesService,
        private readonly usersService: UsersService,
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
    ): Promise<FindBountyDto> {
        logger.info(`Update a bounty entity for index in network by user`, blockchainIndex, networkId, user)
        const bounty = await this.getBounty(networkId, blockchainIndex)

        if (!bounty.entity?.isOwner(user) && !bounty.blockchain.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this bounty')
        }

        if (!bounty.entity) {
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
            await this.repository.save({ ...bounty.entity, ...dto })
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
        { ownerId, status, timeFrame }: BountyFilterQuery,
        paginatedParams: PaginatedParams,
    ): Promise<PaginatedResponseDto<FindBountyDto>> {
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
        status: Nil<BlockchainBountyStatus>,
        paginatedParams: PaginatedParams,
    ): Promise<PaginatedResponseDto<FindBountyDto>> {
        const blockchainBounties = await this.getMappedBlockchainBounties(networkId)
        if (!blockchainBounties.size) return PaginatedResponseDto.empty()
        const bountiesIndexes = keysAsArray(blockchainBounties).sort((a, b) => b - a)

        const [databaseBounties, polkassemblyBountiesPosts] = await Promise.all([
            this.getMappedEntityBounties({ where: { blockchainIndex: In(bountiesIndexes), networkId } }),
            this.getMappedPolkassemblyBounties({
                networkId,
                includeIndexes: bountiesIndexes,
                excludeIndexes: null,
                proposers: null,
            }),
        ])

        const allItems = (
            await Promise.all(
                bountiesIndexes.map((bountyIndex) =>
                    this.createFindBountyDto(
                        blockchainBounties.get(bountyIndex)!,
                        databaseBounties.get(bountyIndex),
                        polkassemblyBountiesPosts.get(bountyIndex),
                        networkId,
                    ),
                ),
            )
        )
            .filter((bounty: FindBountyDto) => !owner || bounty.isOwner(owner))
            .filter((bounty: FindBountyDto) => !status || bounty.hasStatus(status))
        return {
            items: paginatedParams.slice(allItems),
            total: allItems.length,
        }
    }

    private async findOffChain(
        networkId: string,
        owner: Nil<UserEntity>,
        status: Nil<BlockchainBountyStatus>,
        paginatedParams: PaginatedParams,
    ): Promise<PaginatedResponseDto<FindBountyDto>> {
        const blockchainBounties = await this.getMappedBlockchainBounties(networkId)
        const excludeIndexes = keysAsArray(blockchainBounties)

        const polkassemblyBountiesPosts = await this.getMappedPolkassemblyBounties({
            networkId,
            excludeIndexes,
            includeIndexes: null,
            proposers: null,
        })

        const offChainBlockchainIndexes = keysAsArray(polkassemblyBountiesPosts).sort((a, b) => b - a)

        const databaseBounties = await this.getMappedEntityBounties({
            where: { networkId, blockchainIndex: In(offChainBlockchainIndexes) },
        })
        const items = (
            await Promise.all(
                offChainBlockchainIndexes.map((blockchainIndex) =>
                    this.createFindBountyDto(
                        polkassemblyBountiesPosts.get(blockchainIndex)!.asBlockchainBountyDto(),
                        databaseBounties.get(blockchainIndex),
                        polkassemblyBountiesPosts.get(blockchainIndex),
                        networkId,
                    ),
                ),
            )
        )
            .filter((bounty: FindBountyDto) => !owner || bounty.isOwner(owner))
            .filter((bounty: FindBountyDto) => !status || bounty.hasStatus(status))

        return { items: paginatedParams.slice(items), total: items.length }
    }

    async getBounty(networkId: string, blockchainIndex: number): Promise<FindBountyDto> {
        const onChain = await this.bountiesBlockchainService.getBounty(networkId, blockchainIndex)
        const offChain = await this.polkassemblyService.findOne(blockchainIndex, networkId)
        if (!onChain && !offChain) {
            throw new NotFoundException(`Bounty with the given blockchain index was not found: ${blockchainIndex}`)
        }

        const blockchain = onChain ?? offChain!.asBlockchainBountyDto()

        const entity = await this.repository.findOne({ where: { networkId, blockchainIndex } })

        return this.createFindBountyDto(blockchain, entity, offChain, networkId)
    }

    async createFindBountyDto(
        blockchain: BlockchainBountyDto,
        entity: Nil<BountyEntity>,
        polkassembly: Nil<PolkassemblyBountyPostDto>,
        networkId: string,
    ): Promise<FindBountyDto> {
        const proposerAddress = blockchain.proposer
        const beneficiaryAddress = blockchain.beneficiary ?? entity?.beneficiary
        const curatorAddress = blockchain.curator
        const [proposer, beneficiary, curator, childBountiesCount] = await Promise.all([
            this.usersService.getPublicUserDataForWeb3Address(proposerAddress),
            beneficiaryAddress ? this.usersService.getPublicUserDataForWeb3Address(beneficiaryAddress) : null,
            curatorAddress ? this.usersService.getPublicUserDataForWeb3Address(curatorAddress) : null,
            this.childBountiesService.getBountyChildBountiesCount(networkId, blockchain.index),
        ])

        return new FindBountyDto(blockchain, entity, polkassembly, proposer!, curator, beneficiary, childBountiesCount)
    }

    async getBountyMotions(
        networkId: string,
        blockchainIndex: number,
    ): Promise<(ProposedMotionDto | ExecutedMotionDto)[]> {
        let blockchainMotions: ProposedMotionDto[] = []
        try {
            blockchainMotions = await this.bountiesBlockchainService.getMotions(networkId, blockchainIndex)
        } catch (err) {
            logger.info('Error when looking for motions')
        }
        const polkassemblyMotions = await this.polkassemblyService.findMotions(blockchainIndex, networkId)
        return [...blockchainMotions, ...polkassemblyMotions]
    }

    async getOwnerBountiesIndexes(networkId: string, owner?: Nil<UserEntity>): Promise<number[] | null> {
        if (!owner) return null
        const bounties = await this.repository
            .createQueryBuilder('bounties')
            .select('bounties.blockchainIndex')
            .where('bounties.networkId = :networkId', { networkId })
            .andWhere('bounties.ownerId = :ownerId', { ownerId: owner.id })
            .getMany()

        return bounties.map((bounty) => bounty.blockchainIndex)
    }

    async getMappedBlockchainBounties(networkId: string): Promise<Map<number, BlockchainBountyDto>> {
        return arrayToMap(await this.bountiesBlockchainService.getBounties(networkId), 'index')
    }

    async getMappedEntityBounties(options: FindManyOptions): Promise<Map<number, BountyEntity>> {
        return arrayToMap(await this.repository.find(options), 'blockchainIndex')
    }
    async getMappedPolkassemblyBounties(options: GetPosts): Promise<Map<number, PolkassemblyBountyPostDto>> {
        return arrayToMap(await this.polkassemblyService.find(options), 'blockchainIndex')
    }

    async getCurator(networkId: string, blockchainIndex: number): Promise<Nil<PublicUserDto>> {
        const bounty = await this.getBounty(networkId, blockchainIndex)
        return bounty.curator
    }
}
