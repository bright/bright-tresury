import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BlockchainProposal } from '../blockchain/dto/blockchain-proposal.dto'
import { toCreateIdeaProposalDetailsDto } from '../idea-proposal-details/dto/create-idea-proposal-details.dto'
import { IdeaProposalDetailsService } from '../idea-proposal-details/idea-proposal-details.service'
import { IdeaNetwork } from '../ideas/entities/idea-network.entity'
import { Idea } from '../ideas/entities/idea.entity'
import { IdeaMilestoneNetwork } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestone } from '../ideas/idea-milestones/entities/idea-milestone.entity'
import { getLogger } from '../logging.module'
import { MilestoneDetailsService } from '../milestone-details/milestone-details.service'
import { Nil } from '../utils/types'
import { BlockchainProposalWithDomainDetails } from './dto/blockchain-proposal-with-domain-details.dto'
import { Proposal } from './entities/proposal.entity'
import { ProposalMilestone } from './proposal-milestones/entities/proposal-milestone.entity'

const logger = getLogger()

export interface IdeaWithMilestones extends Idea {
    milestones: IdeaMilestone[]
}

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        @InjectRepository(Proposal)
        private readonly proposalsRepository: Repository<Proposal>,
        private readonly ideaProposalDetailsService: IdeaProposalDetailsService,
        private readonly milestoneDetailsService: MilestoneDetailsService,
        @InjectRepository(ProposalMilestone)
        private readonly proposalMilestonesRepository: Repository<ProposalMilestone>,
    ) {}

    async find(networkId: string): Promise<BlockchainProposalWithDomainDetails[]> {
        try {
            const blockchainProposals = await this.blockchainService.getProposals(networkId)

            if (blockchainProposals.length === 0) {
                return []
            }

            const indexes = blockchainProposals.map(({ proposalIndex }: BlockchainProposal) => proposalIndex)

            const proposals = await this.proposalsRepository.find({
                where: { blockchainProposalId: In(indexes), networkId },
                relations: [
                    'ideaNetwork',
                    'ideaNetwork.idea',
                    'ideaMilestoneNetwork',
                    'ideaMilestoneNetwork.ideaMilestone',
                    'ideaMilestoneNetwork.ideaMilestone.idea',
                ],
            })

            return blockchainProposals.map((blockchainProposal: BlockchainProposal) => {
                const proposal = proposals.find((p) => p.blockchainProposalId === blockchainProposal.proposalIndex)
                return this.mergeProposal(blockchainProposal, proposal)
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

        const proposal = await this.proposalsRepository.findOne({
            where: { blockchainProposalId, networkId },
            relations: [
                'ideaNetwork',
                'ideaNetwork.idea',
                'ideaMilestoneNetwork',
                'ideaMilestoneNetwork.ideaMilestone',
                'ideaMilestoneNetwork.ideaMilestone.idea',
            ],
        })

        return this.mergeProposal(blockchainProposal, proposal)
    }

    mergeProposal(
        blockchainProposal: BlockchainProposal,
        proposalEntity: Nil<Proposal>,
    ): BlockchainProposalWithDomainDetails {
        const milestone = proposalEntity?.ideaMilestoneNetwork?.ideaMilestone
        const idea = proposalEntity?.ideaNetwork?.idea ?? milestone?.idea
        return new BlockchainProposalWithDomainDetails({
            blockchain: blockchainProposal,
            entity: proposalEntity,
            isCreatedFromIdea: !!idea && !milestone,
            isCreatedFromIdeaMilestone: !!milestone,
            ideaId: idea?.id,
            ideaMilestoneId: milestone?.id,
        })
    }

    async createFromIdea(
        ideaWithMilestones: IdeaWithMilestones,
        blockchainProposalId: number,
        network: IdeaNetwork,
    ): Promise<Proposal> {
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
        idea: Idea,
        blockchainProposalId: number,
        network: IdeaMilestoneNetwork,
        ideaMilestone: IdeaMilestone,
    ): Promise<Proposal> {
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

    private async assignMilestones(ideaMilestones: IdeaMilestone[], proposal: Proposal): Promise<ProposalMilestone[]> {
        return await Promise.all(
            ideaMilestones.map(async (ideaMilestone) => {
                const details = await this.milestoneDetailsService.create({
                    subject: ideaMilestone.details.subject,
                    dateTo: ideaMilestone.details.dateTo,
                    dateFrom: ideaMilestone.details.dateFrom,
                    description: ideaMilestone.details.description,
                })
                const proposalMilestone = await this.proposalMilestonesRepository.create({
                    ordinalNumber: ideaMilestone.ordinalNumber,
                    details,
                    proposal,
                })
                return await this.proposalMilestonesRepository.save(proposalMilestone)
            }),
        )
    }
}
