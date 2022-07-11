import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { BlockchainChildBountiesService } from '../../blockchain/blockchain-child-bounties/blockchain-child-bounties.service'
import { ListenForChildBountyDto } from './dto/listen-for-child-bounty.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { ExtrinsicsService } from '../../extrinsics/extrinsics.service'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { getLogger } from '../../logging.module'
import { CreateChildBountyDto } from './dto/create-child-bounty.dto'
import { ChildBountyEntity } from './entities/child-bounty.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { FindChildBountyDto } from './dto/find-child-bounty.dto'
import { ChildBountyId } from '../../blockchain/blockchain-child-bounties/child-bounty-id.interface'
import { arrayToMap } from '../../utils/arrayToMap'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { Nil } from '../../utils/types'
import { UsersService } from '../../users/users.service'
import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { UpdateChildBountyDto } from './dto/update-child-bounty.dto'
import { BlockchainChildBountyDto } from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { GetPosts } from '../../polkassembly/polkassembly.service'
import { PolkassemblyChildBountyPostDto } from '../../polkassembly/childBounties/childBounty-post.dto'
import { PolkassemblyChildBountiesService } from '../../polkassembly/childBounties/polkassembly-childBounties.service'

const logger = getLogger()

@Injectable()
export class ChildBountiesService {
    constructor(
        @InjectRepository(ChildBountyEntity) private readonly repository: Repository<ChildBountyEntity>,
        private readonly childBountiesBlockchainService: BlockchainChildBountiesService,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly usersService: UsersService,
        private readonly polkassemblyService: PolkassemblyChildBountiesService,
    ) {}

    async find(networkId: string): Promise<FindChildBountyDto[]> {
        return this.findByChildBountyIds(
            networkId,
            await this.childBountiesBlockchainService.getAllChildBountiesIds(networkId),
        )
    }

    async findByParentBountyBlockchainIndex(
        networkId: string,
        parentBountyBlockchainIndex: number,
    ): Promise<FindChildBountyDto[]> {
        const childBountiesIds = (
            await this.getBountyChildBountiesIds(networkId, parentBountyBlockchainIndex)
        ).map((blockchainIndex) => ({ parentBountyBlockchainIndex, blockchainIndex }))

        return this.findByChildBountyIds(networkId, childBountiesIds)
    }
    private async getBountyChildBountiesIds(networkId: string, parentBountyBlockchainIndex: number) {
        const [polkassemblyChildBountiesIndexes, blockchainChildBountiesIndexes] = await Promise.all([
            // fetch all child bounties blockchainIndexes from polkassembly to include history child bounties also
            this.polkassemblyService.getBountyChildBountiesIds(networkId, parentBountyBlockchainIndex),
            // fetch all child bounties blockchainIndexes so we have reference to active child bounties
            // (safe guard in case polkassembly did not save any child bounty)
            this.childBountiesBlockchainService.getBountyChildBountiesIds(networkId, parentBountyBlockchainIndex),
        ])
        return Array.from(new Set([...polkassemblyChildBountiesIndexes, ...blockchainChildBountiesIndexes]))
    }
    async findByChildBountyIds(networkId: string, childBountyIds: ChildBountyId[]): Promise<FindChildBountyDto[]> {
        const blockchainIndexes = childBountyIds
            .map((childBountyId) => childBountyId.blockchainIndex)
            .sort((a, b) => b - a)

        const [blockchainChildBounties, entityChildBounties, polkassemblyChildBounties] = await Promise.all([
            this.getMappedBlockchainChildBounties(networkId, childBountyIds),
            this.getMappedEntityChildBounties({ where: { blockchainIndex: In(blockchainIndexes), networkId } }),
            this.getMappedPolkassemblyChildBounties({
                networkId,
                includeIndexes: blockchainIndexes,
                excludeIndexes: null,
                proposers: null,
            }),
        ])

        return Promise.all(
            blockchainIndexes.map((blockchainIndex) =>
                this.createFindChildBountyDto(
                    blockchainChildBounties.get(blockchainIndex),
                    polkassemblyChildBounties.get(blockchainIndex),
                    entityChildBounties.get(blockchainIndex),
                ),
            ),
        )
    }

    async findOne(networkId: string, childBountyId: ChildBountyId): Promise<FindChildBountyDto> {
        return (await this.findByChildBountyIds(networkId, [childBountyId]))[0]
    }

    private async createFindChildBountyDto(
        blockchain: Nil<BlockchainChildBountyDto>,
        polkassembly: Nil<PolkassemblyChildBountyPostDto>,
        entity?: Nil<ChildBountyEntity>,
    ): Promise<FindChildBountyDto> {
        if (!blockchain && !polkassembly)
            throw new NotFoundException('No blockchain and no polkassembly childBounty...')

        if (!blockchain) blockchain = polkassembly!.asBlockchainChildBountyDto()

        const beneficiary = blockchain.beneficiary
            ? await this.usersService.getPublicUserDataForWeb3Address(blockchain.beneficiary)
            : null
        const curator = blockchain.curator
            ? await this.usersService.getPublicUserDataForWeb3Address(blockchain.curator)
            : null
        return new FindChildBountyDto(blockchain, polkassembly, entity, curator, beneficiary)
    }

    async getBountyChildBountiesCount(networkId: string, parentBountyBlockchainIndex: number): Promise<number> {
        return (await this.getBountyChildBountiesIds(networkId, parentBountyBlockchainIndex)).length
    }

    private async getMappedBlockchainChildBounties(networkId: string, childBountyIds: ChildBountyId[]) {
        return arrayToMap(
            await this.childBountiesBlockchainService.getChildBountiesWithIds(networkId, childBountyIds),
            'index',
        )
    }

    async getMappedEntityChildBounties(options: FindManyOptions): Promise<Map<number, ChildBountyEntity>> {
        return arrayToMap(await this.repository.find(options), 'blockchainIndex')
    }

    listenForAddedChildBountyExtrinsic(dto: ListenForChildBountyDto, bountyIndex: number, user: UserEntity) {
        const callback = async (events: ExtrinsicEvent[]) => {
            const { parentBountyBlockchainIndex, blockchainIndex } =
                BlockchainChildBountiesService.extractChildBountyIdFromBlockchainEvents(events) ?? {}
            if (parentBountyBlockchainIndex === undefined || blockchainIndex === undefined) return

            logger.info(
                `Child bounty index found {parentBountyBlockchainIndex: ${parentBountyBlockchainIndex}, blockchainIndex: ${blockchainIndex}}. Creating child bounty entity`,
            )
            await this.create(
                {
                    ...dto,
                    blockchainIndex,
                    parentBountyBlockchainIndex,
                },
                user,
            )
        }
        return this.extrinsicsService.listenForExtrinsic(
            dto.networkId,
            { extrinsicHash: dto.extrinsicHash, lastBlockHash: dto.lastBlockHash, data: dto },
            callback,
        )
    }

    create(dto: CreateChildBountyDto, user: UserEntity): Promise<ChildBountyEntity> {
        logger.info(`Creating a child bounty entity`)
        const childBounty = this.repository.create({
            ...dto,
            owner: user,
        })
        return this.repository.save(childBounty)
    }

    async update(
        childBountyId: ChildBountyId,
        networkId: string,
        dto: UpdateChildBountyDto,
        user: UserEntity,
    ): Promise<FindChildBountyDto> {
        logger.info(
            `Update a child bounty entity for index in network by user`,
            childBountyId.blockchainIndex,
            networkId,
            user,
        )
        const childBounty = await this.findOne(networkId, childBountyId)

        if (!childBounty.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this child bounty')
        }

        if (!childBounty.entity) {
            try {
                // construct CreateChildBountyDto object and validate
                const createDto = plainToClass(CreateChildBountyDto, { ...dto, ...childBountyId, networkId })

                await validateOrReject(createDto)

                // create child bounty with validated dto
                await this.create(createDto, user)
            } catch (e: any) {
                throw new BadRequestException(e.message)
            }
        } else {
            await this.repository.save({ ...childBounty.entity, ...dto })
        }
        return await this.findOne(networkId, childBountyId)
    }

    async getMappedPolkassemblyChildBounties(options: GetPosts): Promise<Map<number, PolkassemblyChildBountyPostDto>> {
        return arrayToMap(await this.polkassemblyService.find(options), 'blockchainIndex')
    }
}
