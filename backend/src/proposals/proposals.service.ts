import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BlockchainProposal } from '../blockchain/dto/blockchain-proposal.dto'
import { IdeaProposalDetailsDto } from '../idea-proposal-details/dto/idea-proposal-details.dto'
import { IdeaProposalDetailsService } from '../idea-proposal-details/idea-proposal-details.service'
import { IdeaNetwork } from '../ideas/entities/idea-network.entity'
import { Idea } from '../ideas/entities/idea.entity'
import { getLogger } from '../logging.module'
import { Nil } from '../utils/types'
import { Proposal } from './proposal.entity'

const logger = getLogger()

export type BlockchainProposalWithDomainDetails = BlockchainProposal & {
    title?: string
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    ownerId?: string
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
                relations: ['ideaNetwork', 'ideaNetwork.idea'],
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
            relations: ['ideaNetwork', 'ideaNetwork.idea'],
        })

        return this.mergeProposal(blockchainProposal, proposal)
    }

    mergeProposal(
        blockchainProposal: BlockchainProposal,
        proposal: Nil<Proposal>,
    ): BlockchainProposalWithDomainDetails {
        return {
            ...blockchainProposal,
            isCreatedFromIdea: true, // idea !== undefined,
            isCreatedFromIdeaMilestone: false, // ideaMilestone !== undefined,
            ideaId: proposal?.ideaNetwork?.idea?.id, // ?? ideaMilestone?.idea.id,
            // ideaMilestoneId: ideaMilestone?.id,
            title: proposal?.details.title, // ?? ideaMilestone?.subject,
            ownerId: proposal?.ownerId,
        }
    }

    async create(ideaNetwork: IdeaNetwork, idea: Idea, blockchainProposalId: number): Promise<Proposal> {
        const details = await this.ideaProposalDetailsService.create(new IdeaProposalDetailsDto(idea.details))

        const proposal = this.proposalsRepository.create({
            ownerId: idea.ownerId,
            details,
            networkId: ideaNetwork.name,
            ideaNetwork,
            blockchainProposalId,
        })
        return this.proposalsRepository.save(proposal)
    }
}
