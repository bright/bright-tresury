import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, In, Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { IdeaNetwork } from './ideaNetwork.entity';

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>
    ) { }

    async find(networkName?: string): Promise<Idea[]> {
        const where: FindConditions<Idea> = {}

        if (networkName) {
            const ideaNetworks = await this.ideaNetworkRepository.find({
                relations: ['idea'],
                where: {
                    name: networkName
                }
            })
            if (ideaNetworks.length === 0) {
                return []
            }
            const ideaIds = ideaNetworks.map(pc => pc.idea.id)
            where.id = In(ideaIds)
        }

        return this.ideaRepository.find({
            relations: ['networks'],
            where
        })
    }

    findOne(id?: string, networkId?: string): Promise<Idea | undefined> {
        return this.ideaRepository.findOne(id, {
            relations: ['networks'],
            where: {
                networks: {
                    id: networkId
                }
            }
        })
    }

    async findOneByNetworkId(netwrokId: string): Promise<Idea | undefined> {
        const ideaNetwork = await this.ideaNetworkRepository.findOne(netwrokId, {relations: ['idea']})
        return ideaNetwork?.idea
    }

    async save(createIdeaDto: CreateIdeaDto): Promise<Idea> {
        const idea = await this.ideaRepository.save(new Idea(createIdeaDto.title, createIdeaDto.content, createIdeaDto.beneficiary))
        if (createIdeaDto.networks) {
            await Promise.all(createIdeaDto.networks.map(async (network) => {
                await this.ideaNetworkRepository.save(new IdeaNetwork(network.name, idea, network.value))
            }))
        }
        const result = await this.findOne(idea.id)
        return result ?? idea
    }
}
