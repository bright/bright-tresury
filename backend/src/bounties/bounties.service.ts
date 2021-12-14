import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { Repository } from 'typeorm'
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

const logger = getLogger()

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

    async getBounties(
        networkId: string,
    ): Promise<[BlockchainBountyDto, Nil<BountyEntity>, Nil<PolkassemblyPostDto>][]> {
        const [bountiesBlockchain, bountiesEntities] = await Promise.all([
            this.bountiesBlockchainService.getBounties(networkId),
            this.repository.find({ where: { networkId } }),
        ])
        const blockchainIndexes = bountiesBlockchain.map((bountyBlockchain) => bountyBlockchain.index)
        const bountiesPosts = await this.polkassemblyService.getBounties(blockchainIndexes, networkId)

        const blockchainIndexToEntityBounty = bountiesEntities.reduce((acc, bountyEntity) => {
            return { ...acc, [bountyEntity.blockchainIndex.toString()]: bountyEntity }
        }, {} as { [key: string]: BountyEntity })

        return bountiesBlockchain.map((bountyBlockchain: BlockchainBountyDto) => [
            bountyBlockchain,
            blockchainIndexToEntityBounty[bountyBlockchain.index],
            bountiesPosts.find((post) => post.blockchainIndex === bountyBlockchain.index),
        ])
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
}
