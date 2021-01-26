import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {getLogger} from "../logging.module";
import {Idea} from './idea.entity';
import {IdeaNetwork} from './ideaNetwork.entity';
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {IdeaNetworkDto} from "./dto/ideaNetwork.dto";
import {DefaultIdeaStatus, IdeaStatus} from "./ideaStatus";

const logger = getLogger()

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
        try {
            return networkName ? await this.ideaRepository.createQueryBuilder('idea')
                .leftJoinAndSelect('idea.networks', 'network')
                .where('network.name = :networkName', {networkName})
                .getMany() : await this.ideaRepository.find()
        } catch (error) {
            logger.error(error)
            return []
        }
    }

    async findOne(id: string): Promise<Idea> {
        const idea = await this.ideaRepository.findOne(id, {relations: ['networks']})
        if (!idea) {
            throw new NotFoundException('There is no idea with such id')
        }
        return idea
    }

    async findOneByNetworkId(networkId: string): Promise<Idea | undefined> {
        const ideaNetwork = await this.ideaNetworkRepository.findOne(networkId, {relations: ['idea']})
        if (!ideaNetwork) {
            throw new NotFoundException('There is no idea network with such id')
        }
        return ideaNetwork.idea
    }

    async findByProposalIds(proposalIds: number[], networkName: string): Promise<Map<number, Idea>> {
        const ideaNetworks = await this.ideaNetworkRepository.find({
            relations: ['idea'],
            where: {
                blockchainProposalId: In(proposalIds),
                name: networkName
            }
        })
        const result = new Map<number, Idea>()
        ideaNetworks.forEach(({blockchainProposalId, idea}) => {
            if (blockchainProposalId !== null && idea) {
                result.set(blockchainProposalId, idea)
            }
        })
        return result
    }

    async update(updateIdea: Partial<CreateIdeaDto>, id: string): Promise<Idea> {
        const currentIdea = await this.findOne(id)
        await this.ideaRepository.save({
            ...currentIdea,
            ...updateIdea,
            networks: updateIdea.networks ? updateIdea.networks.map((updatedNetwork: IdeaNetworkDto) => {
                const existingNetwork = currentIdea.networks.find((currentIdeaNetwork: IdeaNetworkDto) =>
                    currentIdeaNetwork.id === updatedNetwork.id
                )
                return {
                    ...existingNetwork,
                    ...updatedNetwork
                }
            }) : currentIdea.networks,
            links: updateIdea.links ? JSON.stringify(updateIdea.links) : currentIdea.links
        })
        return (await this.ideaRepository.findOne(
            id,
            {relations: ['networks']}
        ))!
    }

    async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
        const idea = new Idea(
            createIdeaDto.title,
            createIdeaDto.networks.map((network: IdeaNetworkDto) => new IdeaNetwork(
                network.name,
                network.value
            )),
            DefaultIdeaStatus,
            createIdeaDto.beneficiary,
            createIdeaDto.content,
            createIdeaDto.field,
            createIdeaDto.contact,
            createIdeaDto.portfolio,
            JSON.stringify(createIdeaDto.links),
        )
        const createdIdea = await this.ideaRepository.save(idea)
        return (await this.ideaRepository.findOne(
            createdIdea.id, {relations: ['networks']}
        ))!
    }

    async delete(id: string) {
        const currentIdea = await this.findOne(id)
        await this.ideaRepository.remove(currentIdea)
    }

    /** TODO: validate if idea is ready to be turned into proposal */
    async turnIdeaIntoProposalByNetworkId(networkId: string, blockchainProposalId: number) {
        const idea = await this.findOneByNetworkId(networkId)
        await this.ideaNetworkRepository.save({id: networkId, blockchainProposalId})
        await this.update({status: IdeaStatus.TurnedIntoProposal}, idea!.id)
    }
}
