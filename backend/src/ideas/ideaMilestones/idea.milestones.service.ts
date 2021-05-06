import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {isBefore} from 'date-fns'
import {Repository} from "typeorm";
import {SessionData} from "../../auth/session/session.decorator";
import {IdeasService} from "../ideas.service";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneNetwork} from "./entities/idea.milestone.network.entity";
import {UpdateIdeaMilestoneDto} from "./dto/updateIdeaMilestoneDto";
import {IdeaMilestone} from "./entities/idea.milestone.entity";
import {IdeaMilestoneStatus} from "./ideaMilestoneStatus";
import { CreateIdeaMilestoneNetworkDto } from './dto/createIdeaMilestoneNetworkDto'

@Injectable()
export class IdeaMilestonesService {

    constructor(
        @InjectRepository(IdeaMilestone)
        private readonly ideaMilestoneRepository: Repository<IdeaMilestone>,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>,
        private readonly ideasService: IdeasService
    ) {
    }

    async find(ideaId: string, sessionData: SessionData): Promise<IdeaMilestone[]> {
        const idea = await this.ideasService.findOne(ideaId, sessionData)
        if (!idea) {
            throw new NotFoundException('Idea with the given id not found')
        }
        return await this.ideaMilestoneRepository.find({
            where: { idea },
            relations: ['networks']
        })
    }

    async findOne(ideaMilestoneId: string, sessionData: SessionData): Promise<IdeaMilestone> {
        const ideaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, {
            relations: ['networks', 'idea']
        })
        if (!ideaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }
        ideaMilestone.idea.canGetOrThrow(sessionData.user)
        return ideaMilestone
    }

    async create(
        ideaId: string,
        { subject, beneficiary, dateFrom, dateTo, description, networks }: CreateIdeaMilestoneDto,
        sessionData: SessionData
    ): Promise<IdeaMilestone> {

        const idea = await this.ideasService.findOne(ideaId, sessionData)

        idea.canEditOrThrow(sessionData.user)

        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }

        const savedIdeaMilestone = await this.ideaMilestoneRepository.save(
            new IdeaMilestone(
                idea,
                subject,
                IdeaMilestoneStatus.Active,
                networks.map(({ name, value }: CreateIdeaMilestoneNetworkDto) => new IdeaMilestoneNetwork(name, value)),
                beneficiary,
                dateFrom,
                dateTo,
                description
            )
        )
        return (await this.ideaMilestoneRepository.findOne(savedIdeaMilestone.id, { relations: ['networks'] }))!
    }

    async update(
        ideaMilestoneId: string,
        updateIdeaMilestoneDto: UpdateIdeaMilestoneDto,
        sessionData: SessionData
    ): Promise<IdeaMilestone> {

        const currentIdeaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, { relations: ['networks', 'idea'] })

        if (!currentIdeaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }

        currentIdeaMilestone.idea.canEditOrThrow(sessionData.user)

        const dateFrom = updateIdeaMilestoneDto.dateFrom ?? currentIdeaMilestone.dateFrom
        const dateTo = updateIdeaMilestoneDto.dateTo ?? currentIdeaMilestone.dateTo

        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }

        const updatedNetworks = updateIdeaMilestoneDto.networks && updateIdeaMilestoneDto.networks.map((updatedNetwork: CreateIdeaMilestoneNetworkDto) => {
            const existingNetwork =
                currentIdeaMilestone.networks.find((currentIdeaMilestoneNetwork: IdeaMilestoneNetwork) => currentIdeaMilestoneNetwork.id === updatedNetwork.id)

            if (existingNetwork) {
                return { ...existingNetwork, ...updatedNetwork }
            }

            return this.ideaMilestoneNetworkRepository.create({ name: updatedNetwork.name, value: updatedNetwork.value })
        })

        await this.ideaMilestoneRepository.save( {
            ...currentIdeaMilestone,
            ...updateIdeaMilestoneDto,
            networks: updatedNetworks ?? currentIdeaMilestone.networks
        })

        return (await this.ideaMilestoneRepository.findOne(currentIdeaMilestone.id, { relations: ['networks'] }))!
    }

}
