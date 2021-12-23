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
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame } from '../utils/time-frame.query'
import { PolkassemblyTreasuryProposalPostDto } from '../polkassembly/dto/treasury-proposal-post.dto'
import { ProposedMotionDto } from '../blockchain/dto/proposed-motion.dto'
import { ExecutedMotionDto } from '../polkassembly/dto/executed-motion.dto'

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

    async find(
        networkId: string,
        timeFrame: TimeFrame,
        paginatedParams: PaginatedParams
    ): Promise<PaginatedResponseDto<BlockchainProposalWithDomainDetails>> {
        try {
            if (timeFrame === TimeFrame.OnChain) {
                return this.findOnChain(networkId, paginatedParams)
            } else if (timeFrame === TimeFrame.History) {
                return this.findOffChain(networkId, paginatedParams)
            } else
                return PaginatedResponseDto.empty()
        } catch (error) {
            logger.error(error)
            return PaginatedResponseDto.empty()
        }
    }
    private async findOnChain(
        networkId: string,
        paginatedParams: PaginatedParams
    ) {
        const allBlockchainProposals = await this.blockchainService.getProposals(networkId)
        const blockchainIndexes = allBlockchainProposals
            .sort((bp1, bp2) => bp2.proposalIndex - bp1.proposalIndex)
            .map(bp => bp.proposalIndex)
        if(!blockchainIndexes.length)
            return PaginatedResponseDto.empty()
        const paginatedBlockchainIndexes: number[] = blockchainIndexes.slice(paginatedParams.offset, paginatedParams.offset+paginatedParams.pageSize)
        const databaseProposals = await this.proposalsRepository.find({
            where: { blockchainProposalId: In(paginatedBlockchainIndexes), networkId },
            relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
        })
        const polkassemblyProposalsPosts = await this.polkassemblyService.getProposals({
            indexes: paginatedBlockchainIndexes,
            networkId,
            onChain: true
        })

        const items = paginatedBlockchainIndexes.map(blockchainIndex => {
            const blockchainProposal = allBlockchainProposals.find(bp => bp.proposalIndex === blockchainIndex)!
            const entity = databaseProposals.find(dp => dp.blockchainProposalId === blockchainIndex)
            const polkassemblyProposal = polkassemblyProposalsPosts.find(pp => pp.blockchainIndex === blockchainIndex)
            return this.mergeProposal(blockchainProposal, entity, polkassemblyProposal)
        })
        const total = allBlockchainProposals.length
        return {items, total}
    }

    private async findOffChain(
        networkId: string,
        paginatedParams: PaginatedParams
    ) {
        const allBlockchainProposals = await this.blockchainService.getProposals(networkId)
        const blockchainIndexes = allBlockchainProposals
            .sort((bp1, bp2) => bp2.proposalIndex - bp1.proposalIndex)
            .map(bp => bp.proposalIndex)
        const polkassemblyProposalsPosts = await this.polkassemblyService.getProposals({
            indexes: blockchainIndexes,
            networkId,
            onChain: false,
            paginatedParams,
        })
        const offChainBlockchainIndexes: number[] = polkassemblyProposalsPosts.map(pp => pp.blockchainIndex)
        const databaseProposals = await this.proposalsRepository.find({
            where: { blockchainProposalId: In(offChainBlockchainIndexes), networkId },
            relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
        })
        const items = offChainBlockchainIndexes.map(blockchainIndex => {
            const polkassemblyProposal = polkassemblyProposalsPosts.find(pp => pp.blockchainIndex === blockchainIndex)!
            const blockchainProposal = polkassemblyProposal.asBlockchainProposal()
            const entity = databaseProposals.find(dp => dp.blockchainProposalId === blockchainIndex)
            return this.mergeProposal(blockchainProposal, entity, polkassemblyProposal)
        })
        const total = await this.getTotalProposalsCount(networkId) - allBlockchainProposals.length
        return {items, total}
    }

    async findOne(blockchainProposalId: number, networkId: string): Promise<BlockchainProposalWithDomainDetails> {
        const onChain = await this.blockchainService.getProposal(networkId, blockchainProposalId)
        const offChain = await this.polkassemblyService.getProposal(blockchainProposalId, networkId)

        if (!onChain && !offChain) {
            throw new NotFoundException('Proposal with the given id in the given network not found')
        }

        const blockchainProposal = onChain ?? offChain!.asBlockchainProposal()

        const postgresProposal = await this.proposalsRepository.findOne({
            where: { blockchainProposalId, networkId },
            relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
        })
        return this.mergeProposal(blockchainProposal, postgresProposal, offChain)
    }

    mergeProposal(
        blockchainProposal: BlockchainProposal,
        proposalEntity: Nil<ProposalEntity>,
        polkassemblyProposal?: Nil<PolkassemblyTreasuryProposalPostDto>,
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

    getTotalProposalsCount(networkId: string) {
        return this.blockchainService.getTotalProposalsCount(networkId)
    }

    async getProposalMotions(
        networkId: string,
        blockchainIndex: number,
    ): Promise<(ProposedMotionDto | ExecutedMotionDto)[]> {
        return this.polkassemblyService.getProposalMotions(blockchainIndex, networkId)
    }
}
