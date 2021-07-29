import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BlockchainProposal } from '../blockchain/dto/blockchain-proposal.dto'
import { IdeaProposalDetailsDto } from '../idea-proposal-details/dto/idea-proposal-details.dto'
import { IdeaProposalDetailsService } from '../idea-proposal-details/idea-proposal-details.service'
import { IdeaNetwork } from '../ideas/entities/idea-network.entity'
import { Idea } from '../ideas/entities/idea.entity'
import { IdeaMilestoneNetwork } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestone } from '../ideas/idea-milestones/entities/idea-milestone.entity'
import { getLogger } from '../logging.module'
import { Nil } from '../utils/types'
import { Proposal } from './entities/proposal.entity'

const logger = getLogger()

export type BlockchainProposalWithDomainDetails = {
    blockchain: BlockchainProposal
    entity: Nil<Proposal>
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId: Nil<string>
    ideaMilestoneId: Nil<string>
}

@Injectable()
export class ProposalsService {
    constructor(
        private readonly blockchainService: BlockchainService,
        @InjectRepository(Proposal)
        private readonly proposalsRepository: Repository<Proposal>,
        private readonly ideaProposalDetailsService: IdeaProposalDetailsService,
    ) {}

    async find(networkId: string): Promise<BlockchainProposalWithDomainDetails[]> {
        try {
            const blockchainProposals = await this.blockchainService.getProposals(networkId)

            if (blockchainProposals.length === 0) {
                return []
            }

            const indexes = blockchainProposals.map(({ proposalIndex }: BlockchainProposal) => proposalIndex)

            const proposals = await this.proposalsRepository.find({
                where: { blockchainProposalId: In(indexes), networkId: networkId },
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
        return {
            blockchain: blockchainProposal,
            entity: proposalEntity,
            isCreatedFromIdea: !!idea && !milestone,
            isCreatedFromIdeaMilestone: !!milestone,
            ideaId: idea?.id,
            ideaMilestoneId: milestone?.id,
        }
    }

    async create(idea: Idea, blockchainProposalId: number, network: IdeaNetwork): Promise<Proposal>
    async create(
        idea: Idea,
        blockchainProposalId: number,
        network: IdeaMilestoneNetwork,
        ideaMilestone: IdeaMilestone,
    ): Promise<Proposal>
    async create(
        idea: Idea,
        blockchainProposalId: number,
        network: IdeaNetwork | IdeaMilestoneNetwork,
        ideaMilestone?: IdeaMilestone,
    ): Promise<Proposal> {
        const detailsDto = new IdeaProposalDetailsDto(idea.details, ideaMilestone?.details)
        const details = await this.ideaProposalDetailsService.create(detailsDto)

        const proposal = this.proposalsRepository.create({
            ownerId: idea.ownerId,
            details,
            networkId: network.name,
            ideaNetwork: ideaMilestone ? null : network,
            ideaMilestoneNetwork: ideaMilestone ? network : null,
            blockchainProposalId,
        })
        return this.proposalsRepository.save(proposal)
    }
}
