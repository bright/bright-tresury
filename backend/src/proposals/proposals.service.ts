import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BlockchainProposal } from '../blockchain/dto/blockchain-proposal.dto'
import { toCreateIdeaProposalDetailsDto } from '../idea-proposal-details/dto/create-idea-proposal-details.dto'
import { IdeaProposalDetailsService } from '../idea-proposal-details/idea-proposal-details.service'
import { IdeaNetworkEntity } from '../ideas/entities/idea-network.entity'
import { IdeaEntity } from '../ideas/entities/idea.entity'
import { IdeaMilestoneNetworkEntity } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestoneEntity } from '../ideas/idea-milestones/entities/idea-milestone.entity'
import { getLogger } from '../logging.module'
import { MilestoneDetailsService } from '../milestone-details/milestone-details.service'
import { Nil } from '../utils/types'
import { BlockchainProposalWithDomainDetails } from './dto/blockchain-proposal-with-domain-details.dto'
import { ProposalEntity } from './entities/proposal.entity'
import { ProposalMilestoneEntity } from './proposal-milestones/entities/proposal-milestone.entity'
import { PolkassemblyService } from '../polkassembly/polkassembly.service'
import { PolkassemblyPostDto } from '../polkassembly/dto/polkassembly-post.dto'

const logger = getLogger()

export interface IdeaWithMilestones extends IdeaEntity {
    milestones: IdeaMilestoneEntity[]
}

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        @InjectRepository(ProposalEntity)
        private readonly proposalsRepository: Repository<ProposalEntity>,
        private readonly ideaProposalDetailsService: IdeaProposalDetailsService,
        private readonly milestoneDetailsService: MilestoneDetailsService,
        @InjectRepository(ProposalMilestoneEntity)
        private readonly proposalMilestonesRepository: Repository<ProposalMilestoneEntity>,
        @Inject(PolkassemblyService)
        private readonly polkassemblyService: PolkassemblyService,
    ) {}

    async find(networkId: string): Promise<BlockchainProposalWithDomainDetails[]> {
        try {
            const blockchainProposals = await this.blockchainService.getProposals(networkId)

            if (blockchainProposals.length === 0) {
                return []
            }

            const indexes = blockchainProposals.map(({ proposalIndex }: BlockchainProposal) => proposalIndex)

            const [postgresProposals, polkassemblyProposals] = await Promise.all([
                this.proposalsRepository.find({
                    where: { blockchainProposalId: In(indexes), networkId },
                    relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
                }),
                this.polkassemblyService.getProposals(indexes, networkId),
            ])

            return blockchainProposals.map((blockchainProposal: BlockchainProposal) => {
                const proposal = postgresProposals.find(
                    (p) => p.blockchainProposalId === blockchainProposal.proposalIndex,
                )
                const polkassemblyProposal = polkassemblyProposals.find(
                    (pp: PolkassemblyPostDto) => pp.blockchainIndex === blockchainProposal.proposalIndex,
                )
                return this.mergeProposal(blockchainProposal, proposal, polkassemblyProposal)
            })
        } catch (err) {
            logger.error(err)
            return []
        }
    }

    async findOne(blockchainProposalId: number, networkId: string): Promise<BlockchainProposalWithDomainDetails> {
        const proposals = await this.blockchainService.getProposals(networkId)

        const blockchainProposal = proposals.find(
            ({ proposalIndex }: BlockchainProposal) => proposalIndex === blockchainProposalId,
        )
        if (!blockchainProposal) {
            throw new NotFoundException('Proposal with the given id in the given network not found')
        }

        const [postgresProposal, polkassemblyProposal] = await Promise.all([
            this.proposalsRepository.findOne({
                where: { blockchainProposalId, networkId },
                relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
            }),
            this.polkassemblyService.getProposal(blockchainProposalId, networkId),
        ])

        return this.mergeProposal(blockchainProposal, postgresProposal, polkassemblyProposal)
    }

    mergeProposal(
        blockchainProposal: BlockchainProposal,
        proposalEntity: Nil<ProposalEntity>,
        polkassemblyProposal?: Nil<PolkassemblyPostDto>,
    ): BlockchainProposalWithDomainDetails {
        const milestone = proposalEntity?.ideaMilestoneNetwork?.ideaMilestone
        const ideaId = proposalEntity?.ideaNetwork?.ideaId ?? milestone?.ideaId
        return new BlockchainProposalWithDomainDetails({
            blockchain: blockchainProposal,
            entity: proposalEntity,
            isCreatedFromIdea: !!ideaId && !milestone,
            polkassembly: polkassemblyProposal,
            isCreatedFromIdeaMilestone: !!milestone,
            ideaId,
            ideaMilestoneId: milestone?.id,
        })
    }

    async createFromIdea(
        ideaWithMilestones: IdeaWithMilestones,
        blockchainProposalId: number,
        network: IdeaNetworkEntity,
    ): Promise<ProposalEntity> {
        const detailsDto = toCreateIdeaProposalDetailsDto(ideaWithMilestones.details)
        const details = await this.ideaProposalDetailsService.create(detailsDto)

        const proposal = this.proposalsRepository.create({
            ownerId: ideaWithMilestones.ownerId,
            details,
            networkId: network.name,
            ideaNetwork: network,
            blockchainProposalId,
        })
        const savedProposal = await this.proposalsRepository.save(proposal)

        savedProposal.milestones = await this.assignMilestones(ideaWithMilestones.milestones, proposal)
        return savedProposal
    }

    async createFromMilestone(
        idea: IdeaEntity,
        blockchainProposalId: number,
        network: IdeaMilestoneNetworkEntity,
        ideaMilestone: IdeaMilestoneEntity,
    ): Promise<ProposalEntity> {
        const detailsDto = toCreateIdeaProposalDetailsDto(idea.details, ideaMilestone.details)
        const details = await this.ideaProposalDetailsService.create(detailsDto)

        const proposal = this.proposalsRepository.create({
            ownerId: idea.ownerId,
            details,
            networkId: network.name,
            ideaMilestoneNetwork: network,
            blockchainProposalId,
        })
        return this.proposalsRepository.save(proposal)
    }

    private async assignMilestones(
        ideaMilestones: IdeaMilestoneEntity[],
        proposal: ProposalEntity,
    ): Promise<ProposalMilestoneEntity[]> {
        const proposalMilestones: ProposalMilestoneEntity[] = []
        ideaMilestones.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf())
        for (const ideaMilestone of ideaMilestones) {
            const details = await this.milestoneDetailsService.create({
                subject: ideaMilestone.details.subject,
                dateTo: ideaMilestone.details.dateTo,
                dateFrom: ideaMilestone.details.dateFrom,
                description: ideaMilestone.details.description,
            })
            const proposalMilestone = this.proposalMilestonesRepository.create({
                details,
                proposal,
            })
            proposalMilestones.push(await this.proposalMilestonesRepository.save(proposalMilestone))
        }
        return proposalMilestones
    }
}
