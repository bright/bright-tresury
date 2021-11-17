import { Injectable } from '@nestjs/common'
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

    create(dto: CreateBountyDto, user: UserEntity): Promise<BountyEntity> {
        logger.info(`Creating a bounty entity for index`)
        const bounty = this.repository.create({
            ...dto,
            blockchainIndex: dto.blockchainIndex!,
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

        const blockchainIndexToBlockchainBounty = bountiesBlockchain.reduce((acc, bountyBlockchain) => {
            return {...acc, [bountyBlockchain.index.toString()]: bountyBlockchain}
        }, {} as {[key: string]: BlockchainBountyDto})

        const blockchainIndexToEntityBounty = bountiesEntities.reduce((acc, bountyEntity) => {
            return {...acc, [bountyEntity.blockchainIndex.toString()]: bountyEntity}
        }, {} as {[key: string]: BountyEntity})

        const blockchainIndexes = new Set<string>([...Object.keys(blockchainIndexToBlockchainBounty), ...Object.keys(blockchainIndexToEntityBounty)])

        return [...blockchainIndexes].map((blockchainIndex: string) => new BountyDto(
            blockchainIndexToBlockchainBounty[blockchainIndex],
            blockchainIndexToEntityBounty[blockchainIndex]
        ))
    }
}
