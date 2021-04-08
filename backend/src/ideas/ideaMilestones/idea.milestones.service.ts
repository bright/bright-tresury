import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestone} from "./entities/idea.milestone.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Idea} from "../entities/idea.entity";
import {IdeaMilestoneNetwork} from "./entities/idea.milestone.network.entity";
import {UpdateIdeaMilestoneDto} from "./dto/updateIdeaMilestoneDto";
import {IdeaMilestoneNetworkDto} from "./dto/ideaMilestoneNetworkDto";

@Injectable()
export class IdeaMilestonesService {

    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaMilestone)
        private readonly ideaMilestoneRepository: Repository<IdeaMilestone>,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>
    ) {
    }

    async find(ideaId: string): Promise<IdeaMilestone[]> {
        const idea = await this.ideaRepository.findOne(ideaId)
        if (!idea) {
            throw new NotFoundException('Idea with the given id not found')
        }
        return await this.ideaMilestoneRepository.find({
            where: { ideaId },
            relations: ['networks']
        })
    }

    async create(ideaId: string, { subject, dateFrom, dateTo, description, networks }: CreateIdeaMilestoneDto): Promise<IdeaMilestone> {
        const idea = await this.ideaRepository.findOne(ideaId)
        if (!idea) {
            throw new NotFoundException('Idea with the given id not found')
        }
        return await this.ideaMilestoneRepository.save(
            new IdeaMilestone(
                idea,
                subject,
                networks.map(({ name, value }: IdeaMilestoneNetworkDto) => new IdeaMilestoneNetwork(name, value)),
                dateFrom,
                dateTo,
                description
            )
        )
    }

    async update(ideaMilestoneId: string, updateIdeaMilestoneDto: UpdateIdeaMilestoneDto): Promise<IdeaMilestone> {

        const currentIdeaMilestone = await this.ideaMilestoneRepository.findOne(ideaMilestoneId, { relations: ['networks'] })

        if (!currentIdeaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }

        const updatedNetworks = updateIdeaMilestoneDto.networks && updateIdeaMilestoneDto.networks.map((updatedNetwork: IdeaMilestoneNetworkDto) => {
            const existingNetwork =
                currentIdeaMilestone.networks.find((currentIdeaMilestoneNetwork: IdeaMilestoneNetwork) => currentIdeaMilestoneNetwork.id === updatedNetwork.id)

            return { ...existingNetwork, ...updatedNetwork }
        })

        return await this.ideaMilestoneRepository.save({
            ...currentIdeaMilestone,
            ...updateIdeaMilestoneDto,
            networks: updatedNetworks ? updatedNetworks : currentIdeaMilestone.networks
        })
    }
}
