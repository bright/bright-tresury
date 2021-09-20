import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { CreateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/create-idea-proposal-details.dto'
import { UpdateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { IdeaProposalDetails } from '../../idea-proposal-details/idea-proposal-details.entity'
import { IdeaProposalDetailsService } from '../../idea-proposal-details/idea-proposal-details.service'
import { Proposal } from '../entities/proposal.entity'
import { ProposalsService } from '../proposals.service'

@Injectable()
export class ProposalDetailsService {
    constructor(
        private readonly proposalsService: ProposalsService,
        private readonly ideaProposalDetailsService: IdeaProposalDetailsService,
        @InjectRepository(Proposal)
        private readonly proposalsRepository: Repository<Proposal>,
    ) {}

    async update(
        proposalIndex: number,
        network: string,
        dto: UpdateIdeaProposalDetailsDto,
        { user }: SessionData,
    ): Promise<IdeaProposalDetails> {
        const proposal = await this.proposalsService.findOne(proposalIndex, network)

        if (!proposal.entity) {
            throw new NotFoundException('Details for a proposal with the given id in the given network not found')
        }

        proposal.canEditOrThrow(user)

        return this.ideaProposalDetailsService.update(dto, proposal.entity.details)
    }

    async create(
        proposalIndex: number,
        network: string,
        dto: CreateIdeaProposalDetailsDto,
        { user }: SessionData,
    ): Promise<IdeaProposalDetails> {
        const proposal = await this.proposalsService.findOne(proposalIndex, network)

        if (proposal.entity) {
            throw new ConflictException('Details for a proposal with the given id already exist')
        }

        proposal.canEditOrThrow(user)

        const details = await this.ideaProposalDetailsService.create(dto)
        const proposalEntity = this.proposalsRepository.create({
            ownerId: user.id,
            details,
            networkId: network,
            blockchainProposalId: proposalIndex,
        })
        const savedProposal = await this.proposalsRepository.save(proposalEntity)

        return savedProposal.details
    }
}
