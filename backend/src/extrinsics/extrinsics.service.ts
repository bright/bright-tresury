import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { getLogger } from '../logging.module'
import { CreateExtrinsicDto } from './dto/createExtrinsic.dto'
import { UpdateExtrinsicDto } from './dto/updateExtrinsic.dto'
import { Extrinsic, ExtrinsicStatuses } from './extrinsic.entity'
import { ExtrinsicEvent } from './extrinsicEvent'

const logger = getLogger()

@Injectable()
export class ExtrinsicsService {
    constructor(
        @InjectRepository(Extrinsic) private readonly extrinsicRepository: Repository<Extrinsic>,
        private readonly blockchainService: BlockchainService,
    ) {}

    async findByExtrinsicHash(extrinsicHash: string): Promise<Extrinsic | undefined> {
        return this.extrinsicRepository.findOne({ extrinsicHash })
    }

    async listenForExtrinsic(
        createExtrinsicDto: CreateExtrinsicDto,
        extractEvents?: (events: ExtrinsicEvent[]) => Promise<void>,
    ): Promise<Extrinsic> {
        logger.info(`Save extrinsic to listen for`, createExtrinsicDto)
        const extrinsic = await this.create(createExtrinsicDto)

        const callback = async (updateExtrinsicDto: UpdateExtrinsicDto) => {
            if (extractEvents) {
                await extractEvents(updateExtrinsicDto.events)
            }
            await this.update(extrinsic.id, updateExtrinsicDto)
        }
        await this.blockchainService.listenForExtrinsic(createExtrinsicDto.extrinsicHash, callback)

        return extrinsic
    }

    async create(extrinsicDto: CreateExtrinsicDto): Promise<Extrinsic> {
        const extrinsic = new Extrinsic(extrinsicDto.extrinsicHash, extrinsicDto.lastBlockHash, extrinsicDto.data)
        return await this.extrinsicRepository.save(extrinsic)
    }

    async update(id: string, updateExtrinsicDto: UpdateExtrinsicDto): Promise<Extrinsic | undefined> {
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
