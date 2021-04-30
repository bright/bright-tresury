import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Brackets, In, Not, Repository} from 'typeorm';
import {SessionUser} from "../auth/session/session.decorator";
import {getLogger} from "../logging.module";
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {CreateIdeaNetworkDto} from "./dto/createIdeaNetwork.dto";
import {IdeaNetworkDto} from "./dto/ideaNetwork.dto";
import {UpdateIdeaDto} from "./dto/updateIdea.dto";
import {Idea} from './entities/idea.entity';
import {IdeaNetwork} from './entities/ideaNetwork.entity';
import { DefaultIdeaStatus, IdeaStatus } from './ideaStatus'

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

    async find(networkName?: string, user?: SessionUser): Promise<Idea[]> {
        try {
            return networkName ? await this.ideaRepository.createQueryBuilder('idea')
                    .leftJoinAndSelect('idea.networks', 'network')
                    .where('network.name = :networkName', {networkName})
                    .andWhere(new Brackets((qb) => {
                        qb.where('idea.status != :draftStatus', {draftStatus: IdeaStatus.Draft})
                            .orWhere('idea.ownerId = :ownerId', {ownerId: user?.user.id})
                    }))
                    .getMany()
                : await this.ideaRepository.find({
                    where: [
                        {status: Not(IdeaStatus.Draft)},
                        {ownerId: user?.user.id}
                    ]
                })
        } catch (error) {
            logger.error(error)
            return []
        }
    }

    async findOne(id: string, user?: SessionUser): Promise<Idea> {
        const idea = await this.ideaRepository.findOne(id, {relations: ['networks']})
        if (!idea) {
            throw new NotFoundException('There is no idea with such id')
        }
        idea.canGetOrThrow(user?.user)
        return idea
    }

    async findOneByNetworkId(networkId: string, user: SessionUser): Promise<Idea> {
        const ideaNetwork = await this.ideaNetworkRepository.findOne(networkId, {relations: ['idea']})
        if (!ideaNetwork) {
            throw new NotFoundException(`There is no idea network with id ${networkId}`)
        }
        if (!ideaNetwork.idea) {
            throw new NotFoundException(`There is no idea for network with id: ${networkId}`)
        }
        ideaNetwork.idea.canGetOrThrow(user.user)
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

    async update(updateIdea: UpdateIdeaDto, id: string, user: SessionUser): Promise<Idea> {
        const currentIdea = await this.findOne(id, user)
        currentIdea.canEditOrThrow(user.user)

        await this.ideaRepository.save({
            ...currentIdea,
            ...updateIdea,
            networks: updateIdea.networks ? updateIdea.networks.map((updatedNetwork: CreateIdeaNetworkDto) => {
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

    async create(createIdeaDto: CreateIdeaDto, user: SessionUser): Promise<Idea> {
        const idea = new Idea(
            createIdeaDto.title,
            createIdeaDto.networks.map((network: CreateIdeaNetworkDto) => new IdeaNetwork(
                network.name,
                network.value
            )),
            createIdeaDto.status ?? DefaultIdeaStatus,
            user.user,
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

    async delete(id: string, user: SessionUser) {
        const currentIdea = await this.findOne(id, user)
        currentIdea.canEditOrThrow(user.user)

        await this.ideaRepository.remove(currentIdea)
    }

}
