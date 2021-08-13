import { Injectable, NotFoundException } from '@nestjs/common'
import { ProposalsService } from '../../../proposals/proposals.service'
import { IdeaMilestonesRepository } from '../idea-milestones.repository'
import { CreateIdeaMilestoneProposalDto } from './dto/create-idea-milestone-proposal.dto'
import { ExtrinsicEvent } from '../../../extrinsics/extrinsicEvent'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IdeasService } from '../../ideas.service'
import { IdeaMilestonesService } from '../idea-milestones.service'
import { IdeaMilestoneNetwork } from '../entities/idea-milestone-network.entity'
import { ExtrinsicsService } from '../../../extrinsics/extrinsics.service'
import { IdeaStatus } from '../../entities/idea-status'
import { IdeaMilestoneStatus } from '../entities/idea-milestone-status'
import { Idea } from '../../entities/idea.entity'
import { IdeaMilestone } from '../entities/idea-milestone.entity'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { SessionData } from '../../../auth/session/session.decorator'

@Injectable()
export class IdeaMilestoneProposalsService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaMilestonesRepository)
        private readonly ideaMilestoneRepository: IdeaMilestonesRepository,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>,
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
    ): Promise<IdeaMilestoneNetwork> {
        const idea = await this.ideasService.findOne(ideaId, sessionData)

        idea.canEditOrThrow(sessionData.user)

        idea.canTurnMilestoneIntoProposalOrThrow()

        const ideaMilestone = await this.ideaMilestonesService.findOne(ideaMilestoneId, sessionData)

        ideaMilestone.canTurnIntoProposalOrThrow()

        const ideaMilestoneNetwork = await ideaMilestone.networks.find(({ id }) => id === ideaMilestoneNetworkId)

        if (!ideaMilestoneNetwork) {
            throw new NotFoundException('Idea milestone network with the given id not found')
        }

        ideaMilestoneNetwork.canTurnIntoProposalOrThrow()

        const callback = async (extrinsicEvents: ExtrinsicEvent[]) => {
            const blockchainProposalIndex = this.blockchainService.extractBlockchainProposalIndexFromExtrinsicEvents(
                extrinsicEvents,
            )

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

    // all entities passed to this function as arguments should be already validated
    async turnIdeaMilestoneIntoProposal(
        validIdea: Idea,
        validIdeaMilestone: IdeaMilestone,
        validIdeaMilestoneNetwork: IdeaMilestoneNetwork,
        blockchainProposalIndex: number,
    ): Promise<void> {
        await this.ideaRepository.save({
            ...validIdea,
            status: IdeaStatus.TurnedIntoProposalByMilestone,
        })

        await this.ideaMilestoneRepository.save({
            ...validIdeaMilestone,
            status: IdeaMilestoneStatus.TurnedIntoProposal,
        })

        await this.ideaMilestoneNetworkRepository.save({
            ...validIdeaMilestoneNetwork,
            blockchainProposalId: blockchainProposalIndex,
        })
    }
}
