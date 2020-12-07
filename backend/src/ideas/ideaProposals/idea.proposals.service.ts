import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtrinsicEvent } from "../../extrinsics/extrinsicEvent";
import { ExtrinsicsService } from "../../extrinsics/extrinsics.service";
import {getLogger} from "../../logging.module";
import { Idea } from '../idea.entity';
import { IdeaNetwork } from '../ideaNetwork.entity';
import { CreateIdeaProposalDto } from "./dto/createIdeaProposal.dto";

@Injectable()
export class IdeaProposalsService {
    constructor(
        @InjectRepository(Idea) private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork) private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly extrinsicsService: ExtrinsicsService
    ) {
    }

    async createProposal(ideaId: string, dto: CreateIdeaProposalDto): Promise<IdeaNetwork> {
        const idea = await this.ideaRepository.findOne(ideaId, { relations: ['networks'] })
        if (!idea) {
            throw new NotFoundException('Idea not found.')
        }

        const network = await idea.networks?.find((n) => n.id === dto.ideaNetworkId)
        if (!network) {
            throw new NotFoundException('Idea network not found.')
        }

        const callback = (events: ExtrinsicEvent[]) => {
            return this.extractEvents(events, network)
        }

        const extrinsic = await this.extrinsicsService.listenForExtrinsic(dto, callback)

        network.extrinsic = extrinsic
        await this.ideaNetworkRepository.save({ id: network.id, extrinsic })

        return network
    }

    async extractEvents(events: ExtrinsicEvent[], network: IdeaNetwork): Promise<void> {
        const proposedEvent = events.find((event) => event.section === 'treasury' && event.method === 'Proposed')
        const proposalIndex = Number(proposedEvent?.data.find((d) => d.name === 'ProposalIndex')?.value)
        if (!isNaN(proposalIndex)) {
            await this.ideaNetworkRepository.save({ id: network.id, blockchainProposalId: proposalIndex })
            return
        }
        return
    }

}
