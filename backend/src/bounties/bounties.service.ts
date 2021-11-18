import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { ExtrinsicsService } from '../extrinsics/extrinsics.service'
import { getLogger } from '../logging.module'
import { UserEntity } from '../users/user.entity'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { BountyEntity } from './entities/bounty.entity'
import { BlockchainBountyDto } from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BountyDto } from './dto/bounty.dto'

const logger = getLogger()

@Injectable()
export class BountiesService {
    constructor(
        @InjectRepository(BountyEntity) private readonly repository: Repository<BountyEntity>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly bountiesBlockchainService: BlockchainBountiesService
    ) {}

    create(dto: Omit<CreateBountyDto, 'blockchainIndex'> & { blockchainIndex: number }, user: UserEntity): Promise<BountyEntity> {
        logger.info(`Creating a bounty entity for index`)
        const bounty = this.repository.create({
            ...dto,
            owner: user
        })
        return this.repository.save(bounty)
    }

    async listenForProposeBountyExtrinsic(dto: CreateBountyDto, user: UserEntity): Promise<ExtrinsicEntity> {
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

    async getBounties(networkId: string): Promise<BountyDto[]> {
        const [bountiesBlockchain, bountiesEntities] = await Promise.all([
            this.bountiesBlockchainService.getBounties(networkId),
            this.repository.find({ where: {networkId} })
        ])

        const blockchainIndexToEntityBounty = bountiesEntities.reduce((acc, bountyEntity) => {
            return {...acc, [bountyEntity.blockchainIndex.toString()]: bountyEntity}
        }, {} as {[key: string]: BountyEntity})

        return bountiesBlockchain.map(bountyBlockchain => new BountyDto(
            bountyBlockchain, blockchainIndexToEntityBounty[bountyBlockchain.index]
        ))
    }

    async getBounty(blockchainIndex: number, networkId: string): Promise<BountyDto> {
        const [bountiesBlockchain, bountyEntity] = await Promise.all([
            this.bountiesBlockchainService.getBounties(networkId),
            this.repository.findOne({ where: {networkId, blockchainIndex } })
        ])
        const bountyBlockchain = bountiesBlockchain.find((bounty: BlockchainBountyDto) => bounty.index === blockchainIndex)
        if(!bountyBlockchain)
            throw new NotFoundException(`Bounty with blockchainIndex not found: ${blockchainIndex}`)
        return new BountyDto(bountyBlockchain, bountyEntity)
    }
}
