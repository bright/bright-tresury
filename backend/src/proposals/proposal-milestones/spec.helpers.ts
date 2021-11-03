import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { IdeaProposalDetailsService } from '../../idea-proposal-details/idea-proposal-details.service'
import { MilestoneDetailsDto } from '../../milestone-details/dto/milestone-details.dto'
import { MilestoneDetailsService } from '../../milestone-details/milestone-details.service'
import { NETWORKS } from '../../utils/spec.helpers'
import { ProposalEntity } from '../entities/proposal.entity'
import { ProposalMilestoneEntity } from './entities/proposal-milestone.entity'

export const setUp = async (
    app: INestApplication,
    proposalDto?: Partial<ProposalEntity>,
    detailsDto?: Partial<IdeaProposalDetailsDto>,
) => {
    const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app)

    const proposal = await createProposal(app, sessionHandler, proposalDto, detailsDto)

    return { proposal, sessionHandler }
}

export const createProposal = async (
    app: INestApplication,
    sessionHandler: SessionHandler,
    proposalDto?: Partial<ProposalEntity>,
    detailsDto?: Partial<IdeaProposalDetailsDto>,
) => {
    const detailsService = app.get<IdeaProposalDetailsService>(IdeaProposalDetailsService)
    const details = await detailsService.create({ title: 'title', ...detailsDto })

    const proposalsRepository = app.get<Repository<ProposalEntity>>(getRepositoryToken(ProposalEntity))
    const proposal = await proposalsRepository.create({
        ownerId: sessionHandler.sessionData.user.id,
        networkId: NETWORKS.POLKADOT,
        blockchainProposalId: 0,
        details,
        ...proposalDto,
    })
    return proposalsRepository.save(proposal)
}

export const createProposalMilestone = async (
    app: INestApplication,
    proposal: ProposalEntity,
    milestoneDto?: Partial<ProposalMilestoneEntity>,
    detailsDto?: Partial<MilestoneDetailsDto>,
) => {
    const detailsService = app.get<MilestoneDetailsService>(MilestoneDetailsService)
    const details = await detailsService.create({ subject: 'subject', ...detailsDto })

    const proposalMilestonesRepository = app.get<Repository<ProposalMilestoneEntity>>(
        getRepositoryToken(ProposalMilestoneEntity),
    )
    const milestone = await proposalMilestonesRepository.create({
        proposal,
        details,
        ...milestoneDto,
    })
    return await proposalMilestonesRepository.save(milestone)
}
