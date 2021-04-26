import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SessionUser} from "../../auth/session/session.decorator";
import {ExtrinsicEvent} from "../../extrinsics/extrinsicEvent";
import {ExtrinsicsService} from "../../extrinsics/extrinsics.service";
import {getLogger} from "../../logging.module";
import {IdeaNetwork} from '../entities/ideaNetwork.entity';
import {CreateIdeaProposalDto} from "./dto/createIdeaProposal.dto";
import {IdeasService} from "../ideas.service";
import {EmptyBeneficiaryException} from "../exceptions/emptyBeneficiary.exception";

const logger = getLogger()

@Injectable()
export class IdeaProposalsService {
    constructor(
        @InjectRepository(IdeaNetwork) private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly ideaService: IdeasService,
    ) {
    }

    async createProposal(ideaId: string, dto: CreateIdeaProposalDto, user: SessionUser): Promise<IdeaNetwork> {
        const idea = await this.ideaService.findOne(ideaId, user)

        if (!idea.beneficiary) {
            throw new EmptyBeneficiaryException()
        }

        const network = await idea.networks?.find((n) => n.id === dto.ideaNetworkId)
        if (!network) {
            throw new NotFoundException('Idea network not found.')
        }

        const callback = async (events: ExtrinsicEvent[]) => {
            return await this.extractEvents(events, network, user)
        }

        const extrinsic = await this.extrinsicsService.listenForExtrinsic(dto, callback)

        network.extrinsic = extrinsic
        await this.ideaNetworkRepository.save({id: network.id, extrinsic})

        return network
    }

    async extractEvents(events: ExtrinsicEvent[], network: IdeaNetwork, user: SessionUser): Promise<void> {
        logger.info('Extracting events for section: treasury, method: Proposed')
        const proposedEvent = events.find((event) => event.section === 'treasury' && event.method === 'Proposed')
        if (proposedEvent) {
            logger.info('Event found')
            logger.info(proposedEvent)
            const proposalIndex = Number(proposedEvent?.data.find((d) => d.name === 'ProposalIndex')?.value)
            logger.info(`Proposal index is ${proposalIndex}`)
            if (!isNaN(proposalIndex)) {
                await this.ideaService.turnIdeaIntoProposalByNetworkId(network.id, proposalIndex, user)
                return
            }
        } else {
            logger.warn('Event not found')
        }
        return
    }

}
