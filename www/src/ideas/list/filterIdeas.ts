import {doesIdeaBelongToUser, IdeaDto, IdeaStatus} from "../ideas.api";
import {IdeaFilter} from "./IdeaStatusFilters";

/** TODO: adjust tests when authorization will be possible */
export function filterIdeas(ideas: IdeaDto[], filter: IdeaFilter): IdeaDto[] {
    switch (filter) {
        case IdeaFilter.All:
            return ideas.filter(idea => (
                (idea.status === IdeaStatus.Draft && doesIdeaBelongToUser(idea))
                || idea.status !== IdeaStatus.Draft
            ))
        case IdeaFilter.Mine:
            return ideas.filter(idea => doesIdeaBelongToUser(idea))
        case IdeaFilter.Draft:
            return ideas.filter(idea => idea.status === IdeaStatus.Draft && doesIdeaBelongToUser(idea))
        case IdeaFilter.Active:
            return ideas.filter(idea => idea.status === IdeaStatus.Active)
        case IdeaFilter.TurnedIntoProposal:
            return ideas.filter(idea => idea.status === IdeaStatus.TurnedIntoProposal)
        case IdeaFilter.Closed:
            return ideas.filter(idea => idea.status === IdeaStatus.Closed)
    }
}
