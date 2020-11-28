import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindConditions, In, Repository} from 'typeorm';
import {Idea} from './idea.entity';
import {IdeaNetwork} from './ideaNetwork.entity';
import {CreateIdeaDto} from "./dto/createIdeaDto";
import {IdeaNetworkDto} from "./dto/ideaNetworkDto";

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>
    ) {
    }

    async find(networkName?: string): Promise<Idea[]> {
        return networkName ? await this.ideaRepository.createQueryBuilder('idea')
            .leftJoin('idea.networks', 'network')
            .where('network.name = :networkName', {networkName})
            .getMany() : await this.ideaRepository.find()
    }

    findOne(id: string): Promise<Idea | undefined> {
        return this.ideaRepository.findOne(id, {relations: ['networks']})
    }

    async findOneByNetworkId(networkId: string): Promise<Idea | undefined> {
        const ideaNetwork = await this.ideaNetworkRepository.findOne(networkId, {relations: ['idea']})
        return ideaNetwork?.idea
    }

    async update(updateIdea: Partial<CreateIdeaDto>, id: string): Promise<Idea> {
        const currentIdea = await this.ideaRepository.findOne(id)
        if (!currentIdea) {
            throw new NotFoundException('There is no idea with such id')
        }
        return await this.ideaRepository.save(new Idea(
            updateIdea.title ?? currentIdea.title,
            updateIdea.networks ? updateIdea.networks.map((network: IdeaNetworkDto) => new IdeaNetwork(
                network.name,
                network.value,
                network.id
            )) : currentIdea.networks,
            updateIdea.beneficiary ?? currentIdea.beneficiary,
            updateIdea.content ?? currentIdea.content,
            updateIdea.field ?? currentIdea.field,
            updateIdea.contact ?? currentIdea.contact,
            updateIdea.portfolio ?? currentIdea.portfolio,
            updateIdea.links ? JSON.stringify(updateIdea.links) : currentIdea.links,
            id,
            )
        )
    }

    async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
        const idea = new Idea(
            createIdeaDto.title,
            createIdeaDto.networks.map((network: IdeaNetworkDto) => new IdeaNetwork(
                network.name,
                network.value,
                network.id
            )),
            createIdeaDto.beneficiary,
            createIdeaDto.content,
            createIdeaDto.field,
            createIdeaDto.contact,
            createIdeaDto.portfolio,
            JSON.stringify(createIdeaDto.links),
        )
        return await this.ideaRepository.save(idea)
    }
}
