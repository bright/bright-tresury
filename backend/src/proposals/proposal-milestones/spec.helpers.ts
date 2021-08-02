import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createUserSessionHandlerWithVerifiedEmail } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { IdeaProposalDetailsService } from '../../idea-proposal-details/idea-proposal-details.service'
import { MilestoneDetailsDto } from '../../milestone-details/dto/milestone-details.dto'
import { MilestoneDetailsService } from '../../milestone-details/milestone-details.service'
import { NETWORKS } from '../../utils/spec.helpers'
import { Proposal } from '../entities/proposal.entity'
import { ProposalMilestone } from './entities/proposal-milestone.entity'

export const setUp = async (
    app: INestApplication,
    proposalDto?: Partial<Proposal>,
    detailsDto?: Partial<IdeaProposalDetailsDto>,
) => {
    const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app)

    const detailsService = app.get<IdeaProposalDetailsService>(IdeaProposalDetailsService)
    const details = await detailsService.create({ title: 'title', ...detailsDto })

    const proposalsRepository = app.get<Repository<Proposal>>(getRepositoryToken(Proposal))
    const proposal = await proposalsRepository.create({
        ownerId: sessionHandler.sessionData.user.id,
        networkId: NETWORKS.POLKADOT,
        blockchainProposalId: 0,
        details,
        ...proposalDto,
    })
    const savedProposal = await proposalsRepository.save(proposal)

    return { proposal: savedProposal, sessionHandler }
}

export const createProposalMilestone = async (
    app: INestApplication,
    proposal: Proposal,
    milestoneDto?: Partial<ProposalMilestone>,
    detailsDto?: Partial<MilestoneDetailsDto>,
) => {
    const detailsService = app.get<MilestoneDetailsService>(MilestoneDetailsService)
    const details = await detailsService.create({ subject: 'subject', ...detailsDto })

    const proposalMilestonesRepository = app.get<Repository<ProposalMilestone>>(getRepositoryToken(ProposalMilestone))
    const milestone = await proposalMilestonesRepository.create({
        proposal,
        ordinalNumber: 1,
        details,
        ...milestoneDto,
    })
    return await proposalMilestonesRepository.save(milestone)
}
