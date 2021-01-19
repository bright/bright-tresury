import {IdeaDto, IdeaStatus} from "../ideas.api";
import {IdeaFilter} from "./IdeaStatusFilters";

export function filterIdeas(ideas: IdeaDto[], filter: IdeaFilter): IdeaDto[] {
    switch (filter) {
        case IdeaFilter.All:
            return ideas.filter(idea => idea.status !== IdeaStatus.Draft)
        case IdeaFilter.Active:
            return ideas.filter(idea => idea.status === IdeaStatus.Active)
        case IdeaFilter.Inactive:
            return ideas.filter(idea => idea.status === IdeaStatus.Inactive)
        case IdeaFilter.TurnedIntoProposal:
            return ideas.filter(idea => idea.status === IdeaStatus.TurnedIntoProposal)
        case IdeaFilter.Closed:
            return ideas.filter(idea => idea.status === IdeaStatus.Closed)
    }
}
