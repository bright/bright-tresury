import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { getLogger } from '../logging.module'
import { CreateExtrinsicDto } from './dto/createExtrinsic.dto'
import { UpdateExtrinsicDto } from './dto/updateExtrinsic.dto'
import { ExtrinsicEntity, ExtrinsicStatuses } from './extrinsic.entity'
import { ExtrinsicEvent } from './extrinsicEvent'

const logger = getLogger()

@Injectable()
export class ExtrinsicsService {
    constructor(
        @InjectRepository(ExtrinsicEntity) private readonly extrinsicRepository: Repository<ExtrinsicEntity>,
        private readonly blockchainService: BlockchainService,
    ) {}

    async findByExtrinsicHash(extrinsicHash: string): Promise<ExtrinsicEntity | undefined> {
        return this.extrinsicRepository.findOne({ extrinsicHash })
    }

    async listenForExtrinsic(
        networkId: string,
        createExtrinsicDto: CreateExtrinsicDto,
        extractEvents?: (events: ExtrinsicEvent[]) => Promise<void>,
    ): Promise<ExtrinsicEntity> {
        logger.info(`Save extrinsic to listen for`, createExtrinsicDto)
        const extrinsic = await this.create(createExtrinsicDto)

        const callback = async (updateExtrinsicDto: UpdateExtrinsicDto) => {
            if (extractEvents) {
                await extractEvents(updateExtrinsicDto.events)
            }
            await this.update(extrinsic.id, updateExtrinsicDto)
        }
        await this.blockchainService.listenForExtrinsic(networkId, createExtrinsicDto.extrinsicHash, callback)

        return extrinsic
    }

    async create(extrinsicDto: CreateExtrinsicDto): Promise<ExtrinsicEntity> {
        const extrinsic = new ExtrinsicEntity(extrinsicDto.extrinsicHash, extrinsicDto.lastBlockHash, extrinsicDto.data)
        return await this.extrinsicRepository.save(extrinsic)
    }

    async update(id: string, updateExtrinsicDto: UpdateExtrinsicDto): Promise<ExtrinsicEntity | undefined> {
        const extrinsic = await this.extrinsicRepository.findOne(id)
        if (!extrinsic) {
            return undefined
        }

        extrinsic.blockHash = updateExtrinsicDto.blockHash
        extrinsic.events = updateExtrinsicDto.events
        extrinsic.status = ExtrinsicStatuses.ExtrinsicSuccess
        extrinsic.data = updateExtrinsicDto.data

        return this.extrinsicRepository.save(extrinsic)
    }
}
