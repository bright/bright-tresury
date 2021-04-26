import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateIdeaMilestoneProposalDto} from "./dto/CreateIdeaMilestoneProposalDto";
import {EmptyBeneficiaryException} from "../../exceptions/emptyBeneficiary.exception";
import {ExtrinsicEvent} from "../../../extrinsics/extrinsicEvent";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IdeasService} from "../../ideas.service";
import {IdeaMilestonesService} from "../idea.milestones.service";
import {IdeaMilestoneNetwork} from "../entities/idea.milestone.network.entity";
import {getLogger} from "../../../logging.module";
import {ExtrinsicsService} from "../../../extrinsics/extrinsics.service";
import {IdeaStatus} from "../../ideaStatus";
import {IdeaMilestoneStatus} from "../ideaMilestoneStatus";

const logger = getLogger()

@Injectable()
export class IdeaMilestoneProposalsService {

    constructor(
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly ideaMilestoneNetworkRepository: Repository<IdeaMilestoneNetwork>,
        private readonly ideasService: IdeasService,
        private readonly ideaMilestonesService: IdeaMilestonesService,
        private readonly extrinsicsService: ExtrinsicsService
    ) {
    }

    async createProposal(
        ideaId: string,
        ideaMilestoneId: string,
        createIdeaMilestoneProposalDto: CreateIdeaMilestoneProposalDto
    ): Promise<IdeaMilestoneNetwork> {

        const idea = await this.ideasService.findOne(ideaId)

        if (!idea) {
            throw new NotFoundException('Idea with the given id not found')
        }

        if (!idea.beneficiary) {
            throw new EmptyBeneficiaryException()
        }

        if (idea.status === IdeaStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea with the given id is already converted to proposal')
        }

        const ideaMilestone = await this.ideaMilestonesService.findOne(ideaMilestoneId)

        if (!ideaMilestone) {
            throw new NotFoundException('Idea milestone with the given id not found')
        }

        if (ideaMilestone.status === IdeaMilestoneStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea milestone with the given id is already converted to proposal')
        }

        const ideaMilestoneNetwork = await ideaMilestone.networks.find(({ id }) => id === createIdeaMilestoneProposalDto.ideaMilestoneNetworkId)

        if (!ideaMilestoneNetwork) {
            throw new NotFoundException('Idea milestone network with the given id not found')
        }

        if (ideaMilestoneNetwork.value === 0) {
            throw new BadRequestException('Value of the idea milestone network with the given id has to be greater than zero')
        }

        const callback = async (events: ExtrinsicEvent[]) => {
            return await this.extractEvents(events, ideaId, ideaMilestoneId, ideaMilestoneNetwork.id)
        }

        const extrinsic = await this.extrinsicsService.listenForExtrinsic(createIdeaMilestoneProposalDto, callback)

        ideaMilestoneNetwork.extrinsic = extrinsic

        await this.ideaMilestoneNetworkRepository.save({
            id: ideaMilestoneNetwork.id,
            extrinsic
        })

        return ideaMilestoneNetwork
    }

    async extractEvents(
        events: ExtrinsicEvent[],
        ideaId: string,
        ideaMilestoneId: string,
        ideaMilestoneNetworkId: string
    ): Promise<void> {

        logger.info('Extracting events for section: treasury, method: Proposed')

        const proposedEvent = events.find(({ section, method }) => section === 'treasury' && method === 'Proposed')

        if (proposedEvent) {

            logger.info('Event found')
            logger.info(proposedEvent)

            const proposalIndex = Number(proposedEvent?.data.find(({ name }) => name === 'ProposalIndex')?.value)

            logger.info(`Proposal index is ${proposalIndex}`)

            if (!isNaN(proposalIndex)) {
                await this.ideaMilestonesService.convertIdeaMilestoneToProposal(ideaId, ideaMilestoneId, ideaMilestoneNetworkId, proposalIndex)
                return
            }

        } else {
            logger.warn('Event not found')
        }

        return
    }
}
