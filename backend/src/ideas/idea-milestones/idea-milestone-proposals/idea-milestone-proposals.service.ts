import { Injectable, NotFoundException } from '@nestjs/common'
import { ProposalsService } from '../../../proposals/proposals.service'
import { IdeaMilestonesRepository } from '../idea-milestones.repository'
import { CreateIdeaMilestoneProposalDto } from './dto/create-idea-milestone-proposal.dto'
import { ExtrinsicEvent } from '../../../extrinsics/extrinsicEvent'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IdeasService } from '../../ideas.service'
import { IdeaMilestonesService } from '../idea-milestones.service'
import { IdeaMilestoneNetworkEntity } from '../entities/idea-milestone-network.entity'
import { ExtrinsicsService } from '../../../extrinsics/extrinsics.service'
import { IdeaStatus } from '../../entities/idea-status'
import { IdeaMilestoneStatus } from '../entities/idea-milestone-status'
import { IdeaEntity } from '../../entities/idea.entity'
import { IdeaMilestoneEntity } from '../entities/idea-milestone.entity'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { SessionData } from '../../../auth/session/session.decorator'
import { IdeaMilestoneNetworkStatus } from '../entities/idea-milestone-network-status'

@Injectable()
export class IdeaMilestoneProposalsService {
    constructor(
        @InjectRepository(IdeaEntity)
        private readonly ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(IdeaMilestonesRepository)
        private readonly ideaMilestoneRepository: IdeaMilestonesRepository,
        @InjectRepository(IdeaMilestoneNetworkEntity)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetworkEntity>,
        private readonly ideasService: IdeasService,
        private readonly ideaMilestonesService: IdeaMilestonesService,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly blockchainService: BlockchainService,
        private readonly proposalsService: ProposalsService,
    ) {}

    async createProposal(
        ideaId: string,
        ideaMilestoneId: string,
        { ideaMilestoneNetworkId, extrinsicHash, lastBlockHash }: CreateIdeaMilestoneProposalDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestoneNetworkEntity> {
        const { entity: idea } = await this.ideasService.findOne(ideaId, sessionData)

        idea.isOwnerOrThrow(sessionData.user)

        idea.canTurnMilestoneIntoProposalOrThrow()

        const ideaMilestone = await this.ideaMilestonesService.findOne(ideaMilestoneId, sessionData)
        ideaMilestone.canTurnIntoProposalOrThrow()

        const ideaMilestoneNetwork = await ideaMilestone.networks.find(({ id }) => id === ideaMilestoneNetworkId)

        if (!ideaMilestoneNetwork) {
            throw new NotFoundException('Idea milestone network with the given id not found')
        }

        ideaMilestoneNetwork.canTurnIntoProposalOrThrow()

        const callback = async (extrinsicEvents: ExtrinsicEvent[]) => {
            const blockchainProposalIndex = this.blockchainService.extractProposalIndex(extrinsicEvents)

            if (blockchainProposalIndex !== undefined) {
                await this.turnIdeaMilestoneIntoProposal(
                    idea,
                    ideaMilestone,
                    ideaMilestoneNetwork,
                    blockchainProposalIndex,
                )
                await this.proposalsService.createFromMilestone(
                    idea,
                    blockchainProposalIndex,
                    ideaMilestoneNetwork,
                    ideaMilestone,
                )
            }
        }

        ideaMilestoneNetwork.extrinsic = await this.extrinsicsService.listenForExtrinsic(
            ideaMilestoneNetwork.name,
            {
                extrinsicHash,
                lastBlockHash,
            },
            callback,
        )

        await this.ideaMilestoneNetworkRepository.save(ideaMilestoneNetwork)
        return ideaMilestoneNetwork
    }
    private updateIdeaMilestoneNetworkStatus = (
        ideaMilestoneNetwork: IdeaMilestoneNetworkEntity,
        status: IdeaMilestoneNetworkStatus,
    ): IdeaMilestoneNetworkEntity => ({ ...ideaMilestoneNetwork, status } as IdeaMilestoneNetworkEntity)

    private updateIdeaMilestoneNetworksStatus = (
        ideaMilestoneNetwork: IdeaMilestoneNetworkEntity,
        ideaMilestoneNetworkTurnedIntoProposal: IdeaMilestoneNetworkEntity,
    ): IdeaMilestoneNetworkEntity => {
        if (ideaMilestoneNetwork.id === ideaMilestoneNetworkTurnedIntoProposal.id)
            return this.updateIdeaMilestoneNetworkStatus(
                ideaMilestoneNetworkTurnedIntoProposal,
                IdeaMilestoneNetworkStatus.TurnedIntoProposal,
            )

        const status =
            ideaMilestoneNetwork.status !== IdeaMilestoneNetworkStatus.TurnedIntoProposal
                ? IdeaMilestoneNetworkStatus.Pending
                : IdeaMilestoneNetworkStatus.TurnedIntoProposal
        return this.updateIdeaMilestoneNetworkStatus(ideaMilestoneNetwork, status)
    }

    // all entities passed to this function as arguments should be already validated
    async turnIdeaMilestoneIntoProposal(
        validIdea: IdeaEntity,
        validIdeaMilestone: IdeaMilestoneEntity,
        validIdeaMilestoneNetwork: IdeaMilestoneNetworkEntity,
        blockchainProposalIndex: number,
    ): Promise<void> {
        validIdeaMilestoneNetwork = {
            ...validIdeaMilestoneNetwork,
            blockchainProposalId: blockchainProposalIndex,
        } as IdeaMilestoneNetworkEntity
        // this save updates both ideaMilestone and ideaMilestoneNetwork db entries
        await this.ideaMilestoneRepository.save({
            ...validIdeaMilestone,
            networks: validIdeaMilestone.networks.map((ideaMilestoneNetwork) =>
                this.updateIdeaMilestoneNetworksStatus(ideaMilestoneNetwork, validIdeaMilestoneNetwork),
            ),
            status: IdeaMilestoneStatus.TurnedIntoProposal,
        })

        await this.ideaRepository.save({ ...validIdea, status: IdeaStatus.MilestoneSubmission })
    }
}
