import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { networkInterfaces } from 'os'
import { Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { ExtrinsicEvent } from '../../extrinsics/extrinsicEvent'
import { ExtrinsicsService } from '../../extrinsics/extrinsics.service'
import { getLogger } from '../../logging.module'
import { IdeaWithMilestones, ProposalsService } from '../../proposals/proposals.service'
import { IdeaNetworkStatus } from '../entities/idea-network-status'
import { IdeaNetwork } from '../entities/idea-network.entity'
import { IdeaStatus } from '../entities/idea-status'
import { Idea } from '../entities/idea.entity'
import { IdeaMilestonesService } from '../idea-milestones/idea-milestones.service'
import { IdeasService } from '../ideas.service'
import { CreateIdeaProposalDto } from './dto/create-idea-proposal.dto'

const logger = getLogger()

@Injectable()
export class IdeaProposalsService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly ideasService: IdeasService,
        private readonly blockchainService: BlockchainService,
        private readonly proposalsService: ProposalsService,
        private readonly ideaMilestonesService: IdeaMilestonesService,
    ) {}

    async createProposal(
        ideaId: string,
        { ideaNetworkId, extrinsicHash, lastBlockHash }: CreateIdeaProposalDto,
        sessionData: SessionData,
    ): Promise<IdeaNetwork> {
        logger.info(`Start turning idea ${ideaId} into a proposal.`)
        const idea = await this.ideasService.findOne(ideaId, sessionData)

        idea.canEditOrThrow(sessionData.user)

        idea.canTurnIntoProposalOrThrow()

        const ideaNetwork = await idea.networks.find(({ id }) => id === ideaNetworkId)

        if (!ideaNetwork) {
            throw new NotFoundException('Idea network with the given id not found')
        }

        ideaNetwork.canTurnIntoProposalOrThrow()

        const callback = async (extrinsicEvents: ExtrinsicEvent[]) => {
            const blockchainProposalIndex = this.blockchainService.extractBlockchainProposalIndexFromExtrinsicEvents(
                extrinsicEvents,
            )

            if (blockchainProposalIndex !== undefined) {
                await this.turnIdeaIntoProposal(idea, ideaNetwork, blockchainProposalIndex)
                const milestones = await this.ideaMilestonesService.find(ideaId, sessionData)
                idea.milestones = milestones
                await this.proposalsService.createFromIdea(
                    idea as IdeaWithMilestones,
                    blockchainProposalIndex,
                    ideaNetwork,
                )
            }
        }

        ideaNetwork.extrinsic = await this.extrinsicsService.listenForExtrinsic(
            ideaNetwork.name,
            {
                extrinsicHash,
                lastBlockHash,
            },
            callback,
        )

        await this.ideaNetworkRepository.save(ideaNetwork)

        return ideaNetwork
    }

    // all entities passed to this function as arguments should be already validated
    async turnIdeaIntoProposal(
        validIdea: Idea,
        validIdeaNetwork: IdeaNetwork,
        blockchainProposalIndex: number,
    ): Promise<void> {
        logger.info(`Set idea ${validIdea.id} status to ${IdeaStatus.TurnedIntoProposal}.`)
        await this.ideaRepository.save({
            ...validIdea,
            status: IdeaStatus.TurnedIntoProposal,
        })

        logger.info(`Set other networks statuses to ${IdeaNetworkStatus.Pending}.`)
        for (const network of validIdea.networks) {
            if (network.status !== IdeaNetworkStatus.TurnedIntoProposal) {
                await this.ideaNetworkRepository.save({ ...network, status: IdeaNetworkStatus.Pending })
            }
        }

        logger.info(
            `Set blockchainProposalIndex to ${blockchainProposalIndex} and status to ${IdeaNetworkStatus.TurnedIntoProposal} for the idea network ${validIdeaNetwork.id}.`,
        )
        await this.ideaNetworkRepository.save({
            ...validIdeaNetwork,
            blockchainProposalId: blockchainProposalIndex,
            status: IdeaNetworkStatus.TurnedIntoProposal,
        })
    }
}
