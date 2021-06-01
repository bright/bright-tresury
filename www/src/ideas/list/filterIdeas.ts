import { IdeaFilter } from './IdeaStatusFilters'
import { IdeaDto, IdeaStatus } from '../ideas.dto'
import { doesIdeaBelongToUser } from '../utils/ideas.utils'
import { AuthContextUser } from '../../auth/AuthContext'

export function filterIdeas(ideas: IdeaDto[], filter: IdeaFilter, user?: AuthContextUser): IdeaDto[] {
    switch (filter) {
        case IdeaFilter.All:
            return ideas.filter(
                (idea) =>
                    (idea.status === IdeaStatus.Draft && doesIdeaBelongToUser(idea, user)) ||
                    idea.status !== IdeaStatus.Draft,
            )
        case IdeaFilter.Mine:
            return ideas.filter((idea) => doesIdeaBelongToUser(idea, user))
        case IdeaFilter.Draft:
            return ideas.filter((idea) => idea.status === IdeaStatus.Draft && doesIdeaBelongToUser(idea, user))
        case IdeaFilter.Active:
            return ideas.filter((idea) => idea.status === IdeaStatus.Active)
        case IdeaFilter.TurnedIntoProposal:
            return ideas.filter((idea) => idea.status === IdeaStatus.TurnedIntoProposal)
        case IdeaFilter.Closed:
            return ideas.filter((idea) => idea.status === IdeaStatus.Closed)
    }
}
