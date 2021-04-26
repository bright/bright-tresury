import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {isBefore} from 'date-fns'
import {Repository} from "typeorm";
import {SessionUser} from "../../auth/session/session.decorator";
import {IdeasService} from "../ideas.service";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneNetworkDto} from "./dto/ideaMilestoneNetworkDto";
import {UpdateIdeaMilestoneDto} from "./dto/updateIdeaMilestoneDto";
import {IdeaMilestone} from "./entities/idea.milestone.entity";
import {IdeaMilestoneNetwork} from "./entities/idea.milestone.network.entity";
import {IdeaMilestoneStatus} from "./ideaMilestoneStatus";
import {EmptyBeneficiaryException} from "../exceptions/emptyBeneficiary.exception";
import {IdeaStatus} from "../ideaStatus";

@Injectable()
export class IdeaMilestonesService {

    constructor(
        private readonly ideasService: IdeasService,
        @InjectRepository(IdeaMilestone)
        private readonly ideaMilestoneRepository: Repository<IdeaMilestone>,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>
    ) {
    }

    async find(ideaId: string, session: SessionUser): Promise<IdeaMilestone[]> {
        const idea = await this.ideasService.findOne(ideaId, session)
        if (!idea) {
            throw new NotFoundException('Idea with the given id not found')
        }
        return await this.ideaMilestoneRepository.find({
            where: { idea },
            relations: ['networks']
        })
    }

    async findOne(ideaMilestoneId: string, session: SessionUser): Promise<IdeaMilestone> {
        const ideaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, { relations: ['networks', 'idea'] })
        if (!ideaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }
        ideaMilestone.idea.canGetOrThrow(session.user)
        return ideaMilestone
    }

    async create(ideaId: string, { subject, dateFrom, dateTo, description, networks }: CreateIdeaMilestoneDto, session: SessionUser): Promise<IdeaMilestone> {
        const idea = await this.ideasService.findOne(ideaId, session)
        idea.canEditOrThrow(session.user)

        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }

        const savedIdeaMilestone = await this.ideaMilestoneRepository.save(
            new IdeaMilestone(
                idea,
                subject,
                IdeaMilestoneStatus.Active,
                networks.map(({ name, value }: IdeaMilestoneNetworkDto) => new IdeaMilestoneNetwork(name, value)),
                dateFrom,
                dateTo,
                description
            )
        )
        return (await this.ideaMilestoneRepository.findOne(savedIdeaMilestone.id, { relations: ['networks'] }))!
    }

    async update(ideaMilestoneId: string, updateIdeaMilestoneDto: UpdateIdeaMilestoneDto, session: SessionUser): Promise<IdeaMilestone> {

        const currentIdeaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, { relations: ['networks', 'idea'] })
        if (!currentIdeaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }
        currentIdeaMilestone.idea.canEditOrThrow(session.user)

        const dateFrom = updateIdeaMilestoneDto.dateFrom ?? currentIdeaMilestone.dateFrom
        const dateTo = updateIdeaMilestoneDto.dateTo ?? currentIdeaMilestone.dateTo

        if (dateFrom && dateTo && isBefore(new Date(dateTo), new Date(dateFrom))) {
            throw new BadRequestException('End date of the milestone cannot be prior to the start date')
        }

        const updatedNetworks = updateIdeaMilestoneDto.networks && updateIdeaMilestoneDto.networks.map((updatedNetwork: IdeaMilestoneNetworkDto) => {
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

    async convertIdeaMilestoneToProposal(
        ideaId: string,
        ideaMilestoneId: string,
        ideaMilestoneNetworkId: string,
        blockchainProposalId: number
    ): Promise<void> {

        await this.ideaRepository.save({
            id: ideaId,
            status: IdeaStatus.TurnedIntoProposalByMilestone
        })

        await this.ideaMilestoneRepository.save({
            id: ideaMilestoneId,
            status: IdeaMilestoneStatus.TurnedIntoProposal
        })

        await this.ideaMilestoneNetworkRepository.save({
            id: ideaMilestoneNetworkId,
            blockchainProposalId
        })

    }
}
