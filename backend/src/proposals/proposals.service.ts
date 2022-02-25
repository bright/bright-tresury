import { Injectable, NotFoundException } from '@nestjs/common'
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
import { PolkassemblyTreasuryProposalsService } from '../polkassembly/treasury-proposals/polkassembly-treasury-proposals.service'
import { Nil } from '../utils/types'
import { BlockchainProposalWithDomainDetails } from './dto/blockchain-proposal-with-domain-details.dto'
import { ProposalEntity } from './entities/proposal.entity'
import { ProposalMilestoneEntity } from './proposal-milestones/entities/proposal-milestone.entity'
import { GetPosts } from '../polkassembly/polkassembly.service'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame } from '../utils/time-frame.query'
import { PolkassemblyTreasuryProposalPostDto } from '../polkassembly/treasury-proposals/treasury-proposal-post.dto'
import { ProposedMotionDto } from '../blockchain/dto/proposed-motion.dto'
import { ExecutedMotionDto } from '../polkassembly/dto/executed-motion.dto'
import { ProposalDto, ProposalStatus } from './dto/proposal.dto'
import { UsersService } from '../users/users.service'
import { ProposalsFilterQuery } from './proposals-filter.query'
import { arrayToMap, keysAsArray } from '../utils/arrayToMap'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { UserEntity } from '../users/entities/user.entity'

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
        private readonly usersService: UsersService,
        private readonly polkassemblyService: PolkassemblyTreasuryProposalsService,
    ) {}

    async find(
        networkId: string,
        { ownerId, timeFrame, status }: ProposalsFilterQuery,
        paginatedParams: PaginatedParams,
    ): Promise<PaginatedResponseDto<BlockchainProposalWithDomainDetails>> {
        const owner = ownerId ? await this.usersService.findOne(ownerId) : null
        if (ownerId && !owner) {
            // if ownerId was provided but the user does not exists return empty response
            // because no proposal is assigned to not existing user
            return PaginatedResponseDto.empty()
        }
        try {
            if (timeFrame === TimeFrame.OnChain) return this.findOnChain(networkId, owner, status, paginatedParams)
            else return this.findOffChain(networkId, owner, paginatedParams)
        } catch (error) {
            logger.error(error)
            return PaginatedResponseDto.empty()
        }
    }

    private async findOnChain(
        networkId: string,
        owner: Nil<UserEntity>,
        status: Nil<ProposalStatus>,
        paginatedParams: PaginatedParams,
    ) {
        const blockchainProposals = await this.getMappedBlockchainProposals(networkId)

        if (!blockchainProposals.size) return PaginatedResponseDto.empty()

        const proposalIndexes = keysAsArray(blockchainProposals).sort((a, b) => b - a)

        const databaseProposals = await this.getMappedEntityProposals({
            where: { blockchainProposalId: In(proposalIndexes), networkId },
            relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
        })

        const polkassemblyProposalsPosts = await this.getMappedPolkassemblyProposals({
            networkId,
            includeIndexes: proposalIndexes,
            excludeIndexes: null,
            proposers: [],
        })
        const allItems = proposalIndexes
            .map((blockchainIndex: number) =>
                this.mergeProposal(
                    blockchainProposals.get(blockchainIndex)!,
                    databaseProposals.get(blockchainIndex),
                    polkassemblyProposalsPosts.get(blockchainIndex),
                ),
            )
            .filter(
                (proposal) =>
                    !status || proposal.hasBlockchainProposalStatus(ProposalDto.fromProposalDtoStatus(status)),
            )
            .filter((proposal) => !owner || proposal.isOwner(owner))
        // Note: filtering added in code, not in DB/polkassembly query because we don't get a lot of active on chain proposals
        return {
            items: paginatedParams.slice(allItems),
            total: allItems.length,
        }
    }

    private async findOffChain(networkId: string, owner: Nil<UserEntity>, paginatedParams: PaginatedParams) {
        const blockchainProposals = await this.getMappedBlockchainProposals(networkId)

        const excludeIndexes = keysAsArray(blockchainProposals)
        const includeIndexes = await this.getOwnerProposalsIndexes(networkId, owner)
        const proposers = this.encodeUserWeb3Addresses(networkId, owner)

        const polkassemblySearchOptions = { networkId, excludeIndexes, includeIndexes, proposers }

        const [polkassemblyProposalsPosts, total] = await Promise.all([
            this.getMappedPolkassemblyProposals({ ...polkassemblySearchOptions, paginatedParams }),
            this.polkassemblyService.count(polkassemblySearchOptions),
        ])

        const offChainBlockchainIndexes = keysAsArray(polkassemblyProposalsPosts).sort((a, b) => b - a)

        const databaseProposals = await this.getMappedEntityProposals({
            where: { blockchainProposalId: In(offChainBlockchainIndexes), networkId },
            relations: ['ideaNetwork', 'ideaMilestoneNetwork', 'ideaMilestoneNetwork.ideaMilestone'],
        })
        const items = offChainBlockchainIndexes.map((blockchainIndex) =>
            this.mergeProposal(
                polkassemblyProposalsPosts.get(blockchainIndex)!.asBlockchainProposal(),
                databaseProposals.get(blockchainIndex),
                polkassemblyProposalsPosts.get(blockchainIndex),
            ),
        )

        return { items, total }
    }

    async findOne(blockchainProposalId: number, networkId: string): Promise<BlockchainProposalWithDomainDetails> {
        const onChain = await this.blockchainService.getProposal(networkId, blockchainProposalId)
        const offChain = await this.polkassemblyService.findOne(blockchainProposalId, networkId)

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

    async getProposalMotions(
        networkId: string,
        blockchainIndex: number,
    ): Promise<(ProposedMotionDto | ExecutedMotionDto)[]> {
        return this.polkassemblyService.getProposalMotions(blockchainIndex, networkId)
    }

    async getOwnerProposalsIndexes(networkId: string, owner: Nil<UserEntity>): Promise<number[] | null> {
        if (!owner) return null
        const proposals = await this.proposalsRepository
            .createQueryBuilder('proposals')
            .select('proposals.blockchainProposalId')
            .where('proposals.networkId = :networkId', { networkId })
            .andWhere('proposals.ownerId = :ownerId', { ownerId: owner.id })
            .getMany()

        return proposals.map((proposal) => proposal.blockchainProposalId)
    }

    async getMappedBlockchainProposals(networkId: string): Promise<Map<number, BlockchainProposal>> {
        return arrayToMap(await this.blockchainService.getProposals(networkId), 'proposalIndex')
    }

    async getMappedEntityProposals(options: FindManyOptions): Promise<Map<number, ProposalEntity>> {
        return arrayToMap(await this.proposalsRepository.find(options), 'blockchainProposalId')
    }

    private async getMappedPolkassemblyProposals(
        options: GetPosts,
    ): Promise<Map<number, PolkassemblyTreasuryProposalPostDto>> {
        return arrayToMap(await this.polkassemblyService.find(options), 'blockchainIndex')
    }

    private encodeUserWeb3Addresses(networkId: string, user: Nil<UserEntity>) {
        if (!user || !user.web3Addresses) return null
        return user.web3Addresses.map((w3address) => this.blockchainService.encodeAddress(networkId, w3address.address))
    }
}
