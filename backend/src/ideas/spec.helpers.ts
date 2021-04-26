import {beforeSetupFullApp} from "../utils/spec.helpers";
import {Idea} from "./entities/idea.entity";
import {IdeasService} from "./ideas.service";
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {IdeaMilestonesService} from "./ideaMilestones/idea.milestones.service";
import {IdeaMilestone} from "./ideaMilestones/entities/idea.milestone.entity";
import {CreateIdeaMilestoneDto} from "./ideaMilestones/dto/createIdeaMilestoneDto";

export async function createIdea(
    idea: Partial<CreateIdeaDto>,
    ideasService?: IdeasService
): Promise<Idea> {
    const defaultIdea: CreateIdeaDto = {
        title: 'title',
        networks: [],
        beneficiary: undefined,
        content: ''
    }
    const service: IdeasService = ideasService ?? beforeSetupFullApp().get().get(IdeasService)
    return await service.create({ ...defaultIdea, ...idea })
}

export async function createIdeaMilestone(
    ideaId: string,
    createIdeaMilestoneDto: CreateIdeaMilestoneDto,
    ideaMilestonesService?: IdeaMilestonesService
): Promise<IdeaMilestone> {
    const service: IdeaMilestonesService = ideaMilestonesService ?? beforeSetupFullApp().get().get(IdeaMilestonesService)
    return await service.create(ideaId, createIdeaMilestoneDto)
}
