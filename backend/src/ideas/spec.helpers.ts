import { beforeSetupFullApp } from "../utils/spec.helpers";
import { Idea } from "./idea.entity";
import { IdeasService } from "./ideas.service";

export async function createIdea(idea: Partial<CreateIdeaDto>, ideasService?: IdeasService): Promise<Idea> {
    const defaultIdea: CreateIdeaDto = {
        title: 'title',
        networks: undefined,
        beneficiary: undefined,
        content: ''
    }
    const service: IdeasService = ideasService ?? beforeSetupFullApp().get().get(IdeasService)

    const result = await service.save({ ...defaultIdea, ...idea })
    return result
}
