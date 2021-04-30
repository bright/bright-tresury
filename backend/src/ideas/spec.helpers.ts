import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {v4 as uuid} from "uuid";
import {SessionData} from "../auth/session/session.decorator";
import {User} from "../users/user.entity";
import {beforeSetupFullApp} from "../utils/spec.helpers";
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {Idea} from "./entities/idea.entity";
import {IdeasService} from "./ideas.service";
import {IdeaStatus} from "./ideaStatus";
import {IdeaMilestonesService} from "./ideaMilestones/idea.milestones.service";
import {IdeaMilestone} from "./ideaMilestones/entities/idea.milestone.entity";
import {CreateIdeaMilestoneDto} from "./ideaMilestones/dto/createIdeaMilestoneDto";

export async function createIdea(idea: Partial<CreateIdeaDto>, sessionUser: SessionData, ideasService?: IdeasService
): Promise<Idea> {
    const defaultIdea: CreateIdeaDto = {
        title: 'title',
        networks: [],
        beneficiary: undefined,
        content: '',
        status: IdeaStatus.Active,
    }
    const service: IdeasService = ideasService ?? beforeSetupFullApp().get().get(IdeasService)
    return await service.create({ ...defaultIdea, ...idea }, sessionUser)
}

export async function createIdeaMilestone(
    ideaId: string,
    createIdeaMilestoneDto: CreateIdeaMilestoneDto,
    sessionUser: SessionData,
    ideaMilestonesService?: IdeaMilestonesService
): Promise<IdeaMilestone> {
    const service: IdeaMilestonesService = ideaMilestonesService ?? beforeSetupFullApp().get().get(IdeaMilestonesService)
    return await service.create(ideaId, createIdeaMilestoneDto, sessionUser)
}

export async function createSessionUser(user: Partial<User> = {}, usersRepository?: Repository<User>): Promise<SessionData> {
    const defaultUser = new User(
        user.id ?? uuid(),
        user.username ?? 'chuck',
        user.email ?? 'chuck@test.test')

    const repository: Repository<User> = usersRepository ?? beforeSetupFullApp().get().get(getRepositoryToken(User))
    const userEntity = await repository.save({...defaultUser, ...user})
    return {user: userEntity}
}
