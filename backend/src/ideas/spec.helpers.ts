import { beforeSetupFullApp } from "../utils/spec.helpers";
import { Idea } from "./entities/idea.entity";
import { IdeasService } from "./ideas.service";
import {CreateIdeaDto} from "./dto/createIdea.dto";

export async function createIdea(idea: Partial<CreateIdeaDto>, ideasService?: IdeasService): Promise<Idea> {
    const defaultIdea: CreateIdeaDto = {
        title: 'title',
        networks: [],
        beneficiary: undefined,
        content: ''
    }
    const service: IdeasService = ideasService ?? beforeSetupFullApp().get().get(IdeasService)

    const result = await service.create({ ...defaultIdea, ...idea })
    return result
}
