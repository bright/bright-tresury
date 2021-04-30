import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SessionUser} from "../../auth/session/session.decorator";
import {ExtrinsicEvent} from "../../extrinsics/extrinsicEvent";
import {ExtrinsicsService} from "../../extrinsics/extrinsics.service";
import {IdeaNetwork} from '../entities/ideaNetwork.entity';
import {CreateIdeaProposalDto} from "./dto/createIdeaProposal.dto";
import {IdeasService} from "../ideas.service";
import {EmptyBeneficiaryException} from "../exceptions/emptyBeneficiary.exception";
import { BlockchainService } from '../../blockchain/blockchain.service'
import { Idea } from '../entities/idea.entity'
import { IdeaStatus } from '../ideaStatus'
import { IdeaMilestoneNetwork } from '../ideaMilestones/entities/idea.milestone.network.entity'

@Injectable()
export class IdeaProposalsService {
    constructor(
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
        private readonly extrinsicsService: ExtrinsicsService,
        private readonly ideasService: IdeasService,
        private readonly blockchainService: BlockchainService
    ) {
    }

    async createProposal(ideaId: string, createIdeaProposalDto: CreateIdeaProposalDto, user: SessionUser): Promise<IdeaNetwork> {

        const idea = await this.ideasService.findOne(ideaId, user)

        idea.canEditOrThrow(user.user)

        if (!idea.beneficiary) {
            throw new EmptyBeneficiaryException()
        }

        if (idea.status === IdeaStatus.TurnedIntoProposal || idea.status === IdeaStatus.TurnedIntoProposalByMilestone) {
            throw new BadRequestException(`Idea with the given id or at least one of it's milestones is already converted to proposal`)
        }

        const ideaNetwork = await idea.networks?.find(({ id }) => id === createIdeaProposalDto.ideaNetworkId)

        if (!ideaNetwork) {
            throw new NotFoundException('Idea network with the given id not found')
        }

        if (ideaNetwork.value === 0) {
            throw new BadRequestException('Value of the idea network with the given id has to be greater than zero')
        }

        const callback = async (events: ExtrinsicEvent[]) => {

            const blockchainProposalIndex = this.blockchainService.extractBlockchainProposalIndexFromExtrinsicEvents(events)

            if (blockchainProposalIndex !== undefined) {
                await this.turnIdeaIntoProposal(idea, ideaNetwork, blockchainProposalIndex)
            }
        }

        ideaNetwork.extrinsic = await this.extrinsicsService.listenForExtrinsic(createIdeaProposalDto, callback)

        await this.ideaNetworkRepository.save(ideaNetwork)

        return ideaNetwork
    }

    // all entities passed to this function as arguments should be already validated
    private async turnIdeaIntoProposal(
        validIdea: Idea,
        validIdeaNetwork: IdeaNetwork,
        blockchainProposalIndex: number
    ): Promise<void> {

        await this.ideaRepository.save({
            ...validIdea,
            status: IdeaStatus.TurnedIntoProposal
        })

        await this.ideaNetworkRepository.save({
            ...validIdeaNetwork,
            blockchainProposalId: blockchainProposalIndex
        })
    }

}
