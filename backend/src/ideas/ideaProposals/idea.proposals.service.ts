import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ExtrinsicEvent} from "../../extrinsics/extrinsicEvent";
import {ExtrinsicsService} from "../../extrinsics/extrinsics.service";
import {getLogger} from "../../logging.module";
import {IdeaNetwork} from '../ideaNetwork.entity';
import {CreateIdeaProposalDto} from "./dto/createIdeaProposal.dto";
import {IdeasService} from "../ideas.service";
import {IdeaStatus} from "../ideaStatus";

const logger = getLogger()

@Injectable()
export class IdeaProposalsService {
    constructor(
        @InjectRepository(IdeaNetwork) private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly ideaService: IdeasService,
    ) {
    }

    async createProposal(ideaId: string, dto: CreateIdeaProposalDto): Promise<IdeaNetwork> {
        const idea = await this.ideaService.findOne(ideaId)

        const network = await idea.networks?.find((n) => n.id === dto.ideaNetworkId)
        if (!network) {
            throw new NotFoundException('Idea network not found.')
        }

        const callback = async (events: ExtrinsicEvent[]) => {
            return await this.extractEvents(events, network)
        }

        const extrinsic = await this.extrinsicsService.listenForExtrinsic(dto, callback)

        network.extrinsic = extrinsic
        await this.ideaNetworkRepository.save({id: network.id, extrinsic})

        return network
    }

    async extractEvents(events: ExtrinsicEvent[], network: IdeaNetwork): Promise<void> {
        logger.info('Extracting events for section: treasury, method: Proposed')
        const proposedEvent = events.find((event) => event.section === 'treasury' && event.method === 'Proposed')
        if (proposedEvent) {
            logger.info('Event found')
            logger.info(proposedEvent)
            const proposalIndex = Number(proposedEvent?.data.find((d) => d.name === 'ProposalIndex')?.value)
            logger.info(`Proposal index is ${proposalIndex}`)
            if (!isNaN(proposalIndex)) {
                await this.ideaNetworkRepository.save({id: network.id, blockchainProposalId: proposalIndex})
                const idea = await this.ideaService.findOneByNetworkId(network.id)
                await this.ideaService.update({status: IdeaStatus.TurnedIntoProposal}, idea!.id)
                return
            }
        } else {
            logger.warn('Event not found')
        }
        return
    }

}
