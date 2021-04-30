import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateIdeaMilestoneProposalDto} from "./dto/CreateIdeaMilestoneProposalDto";
import {EmptyBeneficiaryException} from "../../exceptions/emptyBeneficiary.exception";
import {ExtrinsicEvent} from "../../../extrinsics/extrinsicEvent";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IdeasService} from "../../ideas.service";
import {IdeaMilestonesService} from "../idea.milestones.service";
import {IdeaMilestoneNetwork} from "../entities/idea.milestone.network.entity";
import {ExtrinsicsService} from "../../../extrinsics/extrinsics.service";
import {IdeaStatus} from "../../ideaStatus";
import {IdeaMilestoneStatus} from "../ideaMilestoneStatus";
import {Idea} from "../../entities/idea.entity";
import {IdeaMilestone} from "../entities/idea.milestone.entity";
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { SessionData } from '../../../auth/session/session.decorator'

@Injectable()
export class IdeaMilestoneProposalsService {

    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaMilestone)
        private readonly ideaMilestoneRepository: Repository<IdeaMilestone>,
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>,
        private readonly ideasService: IdeasService,
        private readonly ideaMilestonesService: IdeaMilestonesService,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly blockchainService: BlockchainService
    ) {
    }

    async createProposal(
        ideaId: string,
        ideaMilestoneId: string,
        { ideaMilestoneNetworkId,  extrinsicHash, lastBlockHash }: CreateIdeaMilestoneProposalDto,
        sessionData: SessionData
    ): Promise<IdeaMilestoneNetwork> {

        const idea = await this.ideasService.findOne(ideaId, sessionData)

        idea.canEditOrThrow(sessionData.user)

        if (!idea.beneficiary) {
            throw new EmptyBeneficiaryException()
        }

        if (idea.status === IdeaStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea with the given id is already converted to proposal')
        }

        const ideaMilestone = await this.ideaMilestonesService.findOne(ideaMilestoneId, sessionData)

        if (ideaMilestone.status === IdeaMilestoneStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea milestone with the given id is already converted to proposal')
        }

        const ideaMilestoneNetwork = await ideaMilestone.networks.find(({ id }) => id === ideaMilestoneNetworkId)

        if (!ideaMilestoneNetwork) {
            throw new NotFoundException('Idea milestone network with the given id not found')
        }

        if (ideaMilestoneNetwork.value === 0) {
            throw new BadRequestException('Value of the idea milestone network with the given id has to be greater than zero')
        }

        const callback = async (extrinsicEvents: ExtrinsicEvent[]) => {

            const blockchainProposalIndex = this.blockchainService.extractBlockchainProposalIndexFromExtrinsicEvents(extrinsicEvents)

            if (blockchainProposalIndex !== undefined) {
                await this.turnIdeaMilestoneIntoProposal(idea, ideaMilestone, ideaMilestoneNetwork, blockchainProposalIndex)
            }
        }

        ideaMilestoneNetwork.extrinsic = await this.extrinsicsService.listenForExtrinsic({ extrinsicHash, lastBlockHash }, callback)

        await this.ideaMilestoneNetworkRepository.save(ideaMilestoneNetwork)

        return ideaMilestoneNetwork
    }

    // all entities passed to this function as arguments should be already validated
    private async turnIdeaMilestoneIntoProposal(
        validIdea: Idea,
        validIdeaMilestone: IdeaMilestone,
        validIdeaMilestoneNetwork: IdeaMilestoneNetwork,
        blockchainProposalIndex: number
    ): Promise<void> {

        await this.ideaRepository.save({
            ...validIdea,
            status: IdeaStatus.TurnedIntoProposalByMilestone
        })

        await this.ideaMilestoneRepository.save({
            ...validIdeaMilestone,
            status: IdeaMilestoneStatus.TurnedIntoProposal
        })

        await this.ideaMilestoneNetworkRepository.save({
            ...validIdeaMilestoneNetwork,
            blockchainProposalId: blockchainProposalIndex
        })
    }

}
