import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { SessionData } from '../auth/session/session.decorator'
import { UserEntity } from '../users/entities/user.entity'
import { Web3AddressEntity } from '../users/web3-addresses/web3-address.entity'
import { beforeSetupFullApp } from '../utils/spec.helpers'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { IdeaStatus } from './entities/idea-status'
import { IdeaEntity } from './entities/idea.entity'
import { CreateIdeaMilestoneDto } from './idea-milestones/dto/create-idea-milestone.dto'
import { IdeaMilestoneEntity } from './idea-milestones/entities/idea-milestone.entity'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { IdeaMilestonesService } from './idea-milestones/idea-milestones.service'
import { IdeasService } from './ideas.service'
import { UserStatus } from '../users/entities/user-status'

export async function createIdea(
    idea: Partial<CreateIdeaDto>,
    sessionData: SessionData,
    ideasService?: IdeasService,
): Promise<IdeaEntity> {
    const defaultIdea: CreateIdeaDto = {
        details: { title: 'title', content: '' },
        networks: [],
        beneficiary: undefined,
        status: IdeaStatus.Active,
    }
    const service: IdeasService = ideasService ?? beforeSetupFullApp().get().get(IdeasService)
    const { entity } = await service.create({ ...defaultIdea, ...idea }, sessionData)
    return entity
}

export async function createIdeaMilestone(
    ideaId: string,
    createIdeaMilestoneDto: Partial<CreateIdeaMilestoneDto>,
    sessionData: SessionData,
    ideaMilestonesService?: IdeaMilestonesService,
): Promise<IdeaMilestoneEntity> {
    const defaultMilestone: CreateIdeaMilestoneDto = {
        details: { subject: 'ideaMilestoneSubject', dateFrom: null, dateTo: null, description: 'description' },
        networks: [],
        beneficiary: undefined,
    }
    const service: IdeaMilestonesService =
        ideaMilestonesService ?? beforeSetupFullApp().get().get(IdeaMilestonesService)
    return await service.create(ideaId, { ...defaultMilestone, ...createIdeaMilestoneDto }, sessionData)
}

export async function saveIdeaMilestone(
    ideaMilestone: IdeaMilestoneEntity,
    ideaMilestoneRepository?: IdeaMilestonesRepository,
): Promise<IdeaMilestoneEntity> {
    const repository: IdeaMilestonesRepository =
        ideaMilestoneRepository ?? beforeSetupFullApp().get().get(IdeaMilestonesRepository)
    return await repository.save(ideaMilestone)
}

export async function createWeb3SessionData(address: string) {
    return createSessionData({
        email: `${address}@example.com`,
        username: address,
        web3Addresses: [new Web3AddressEntity(address, true)],
    })
}

export async function createSessionData(
    user: Partial<UserEntity> = {},
    usersRepository?: Repository<UserEntity>,
): Promise<SessionData> {
    const defaultUser = new UserEntity(
        user.id ?? uuid(),
        user.username ?? 'chuck',
        user.email ?? 'chuck@test.test',
        user.status ?? UserStatus.EmailPasswordEnabled,
    )

    const repository: Repository<UserEntity> =
        usersRepository ?? beforeSetupFullApp().get().get(getRepositoryToken(UserEntity))
    const userEntity = await repository.save({ ...defaultUser, ...user })
    return { user: userEntity }
}
