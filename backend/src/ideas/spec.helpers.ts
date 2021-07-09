import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { SessionData } from '../auth/session/session.decorator'
import { User } from '../users/user.entity'
import { beforeSetupFullApp } from '../utils/spec.helpers'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { Idea } from './entities/idea.entity'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { IdeasService } from './ideas.service'
import { IdeaStatus } from './idea-status'
import { IdeaMilestonesService } from './idea-milestones/idea-milestones.service'
import { IdeaMilestone } from './idea-milestones/entities/idea-milestone.entity'
import { CreateIdeaMilestoneDto } from './idea-milestones/dto/create-idea-milestone.dto'

export async function createIdea(
    idea: Partial<CreateIdeaDto>,
    sessionData: SessionData,
    ideasService?: IdeasService,
): Promise<Idea> {
    const defaultIdea: CreateIdeaDto = {
        details: { title: 'title', content: '' },
        networks: [],
        beneficiary: undefined,
        status: IdeaStatus.Active,
    }
    const service: IdeasService = ideasService ?? beforeSetupFullApp().get().get(IdeasService)
    return await service.create({ ...defaultIdea, ...idea }, sessionData)
}

export async function createIdeaMilestone(
    ideaId: string,
    createIdeaMilestoneDto: CreateIdeaMilestoneDto,
    sessionData: SessionData,
    ideaMilestonesService?: IdeaMilestonesService,
): Promise<IdeaMilestone> {
    const service: IdeaMilestonesService =
        ideaMilestonesService ?? beforeSetupFullApp().get().get(IdeaMilestonesService)
    return await service.create(ideaId, createIdeaMilestoneDto, sessionData)
}

export async function createIdeaMilestoneByEntity(
    ideaMilestone: IdeaMilestone,
    ideaMilestoneRepository?: IdeaMilestonesRepository,
): Promise<IdeaMilestone> {
    const repository: IdeaMilestonesRepository =
        ideaMilestoneRepository ?? beforeSetupFullApp().get().get(IdeaMilestonesRepository)
    return await repository.save(ideaMilestone)
}

export async function createSessionData(
    user: Partial<User> = {},
    usersRepository?: Repository<User>,
): Promise<SessionData> {
    const defaultUser = new User(user.id ?? uuid(), user.username ?? 'chuck', user.email ?? 'chuck@test.test', true)

    const repository: Repository<User> = usersRepository ?? beforeSetupFullApp().get().get(getRepositoryToken(User))
    const userEntity = await repository.save({ ...defaultUser, ...user })
    return { user: userEntity }
}
