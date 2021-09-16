import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isBefore } from 'date-fns'
import { Repository } from 'typeorm'
import { UpdateIdeaProposalDetailsDto } from '../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { IdeaProposalDetails } from '../idea-proposal-details/idea-proposal-details.entity'
import { Nil } from '../utils/types'
import { CreateMilestoneDetailsDto } from './dto/create-milestone-details.dto'
import { UpdateMilestoneDetailsDto } from './dto/update-milestone-details.dto'
import { MilestoneDetails } from './entities/milestone-details.entity'

@Injectable()
export class MilestoneDetailsService {
    constructor(
        @InjectRepository(MilestoneDetails)
        private readonly detailsRepository: Repository<MilestoneDetails>,
    ) {}

    async create(dto: CreateMilestoneDetailsDto): Promise<MilestoneDetails> {
        this.validateDates(dto)

        const details = await this.detailsRepository.create(dto)
        return this.detailsRepository.save(details)
    }

    async update(dto: UpdateMilestoneDetailsDto, details: MilestoneDetails): Promise<MilestoneDetails> {
        const updatedDetails = { ...details, ...dto }
        this.validateDates(updatedDetails)

        await this.detailsRepository.save(updatedDetails)

        return (await this.detailsRepository.findOne(details.id))!
    }

    async delete(details: MilestoneDetails): Promise<void> {
        await this.detailsRepository.remove(details)
    }

    private validateDates({ dateFrom, dateTo }: { dateFrom?: Nil<Date>; dateTo?: Nil<Date> }) {
        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }
    }
}
