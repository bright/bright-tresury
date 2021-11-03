import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isBefore } from 'date-fns'
import { Repository } from 'typeorm'
import { Nil } from '../utils/types'
import { CreateMilestoneDetailsDto } from './dto/create-milestone-details.dto'
import { UpdateMilestoneDetailsDto } from './dto/update-milestone-details.dto'
import { MilestoneDetailsEntity } from './entities/milestone-details.entity'

@Injectable()
export class MilestoneDetailsService {
    constructor(
        @InjectRepository(MilestoneDetailsEntity)
        private readonly detailsRepository: Repository<MilestoneDetailsEntity>,
    ) {}

    async create(dto: CreateMilestoneDetailsDto): Promise<MilestoneDetailsEntity> {
        this.validateDates(dto)

        const details = await this.detailsRepository.create(dto)
        return this.detailsRepository.save(details)
    }

    async update(dto: UpdateMilestoneDetailsDto, details: MilestoneDetailsEntity): Promise<MilestoneDetailsEntity> {
        const updatedDetails = { ...details, ...dto }
        this.validateDates(updatedDetails)

        await this.detailsRepository.save(updatedDetails)

        return (await this.detailsRepository.findOne(details.id))!
    }

    async delete(details: MilestoneDetailsEntity): Promise<void> {
        await this.detailsRepository.remove(details)
    }

    private validateDates({ dateFrom, dateTo }: { dateFrom?: Nil<Date>; dateTo?: Nil<Date> }) {
        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }
    }
}
