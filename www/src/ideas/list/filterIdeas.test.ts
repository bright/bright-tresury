import { filterIdeas } from './filterIdeas'
import { IdeaFilter } from './IdeaStatusFilters'
import { IdeaDto, IdeaStatus } from '../ideas.dto'

describe('filter ideas', () => {
    test('filter ideas by all', () => {
        const ideas = [
            createIdea(IdeaStatus.Active),
            createIdea(IdeaStatus.Draft),
            createIdea(IdeaStatus.TurnedIntoProposal),
            createIdea(IdeaStatus.Closed),
        ]

        expect(filterIdeas(ideas, IdeaFilter.All)).toStrictEqual([ideas[0], ideas[1], ideas[2], ideas[3]])
    })
    test('filter ideas by draft', () => {
        const ideas = [
            createIdea(IdeaStatus.Active),
            createIdea(IdeaStatus.Draft),
            createIdea(IdeaStatus.Draft),
            createIdea(IdeaStatus.TurnedIntoProposal),
            createIdea(IdeaStatus.Closed),
        ]

        expect(filterIdeas(ideas, IdeaFilter.Draft)).toStrictEqual([ideas[1], ideas[2]])
    })
    test('filter ideas by active', () => {
        const ideas = [
            createIdea(IdeaStatus.Active),
            createIdea(IdeaStatus.Draft),
            createIdea(IdeaStatus.Active),
            createIdea(IdeaStatus.TurnedIntoProposal),
            createIdea(IdeaStatus.Closed),
        ]

        expect(filterIdeas(ideas, IdeaFilter.Active)).toStrictEqual([ideas[0], ideas[2]])
    })
    test('filter ideas by turned into proposal', () => {
        const ideas = [
            createIdea(IdeaStatus.Active),
            createIdea(IdeaStatus.TurnedIntoProposal),
            createIdea(IdeaStatus.TurnedIntoProposal),
            createIdea(IdeaStatus.TurnedIntoProposal),
            createIdea(IdeaStatus.Closed),
        ]

        expect(filterIdeas(ideas, IdeaFilter.TurnedIntoProposal)).toStrictEqual([ideas[1], ideas[2], ideas[3]])
    })
    test('filter ideas by closed', () => {
        const ideas = [
            createIdea(IdeaStatus.Closed),
            createIdea(IdeaStatus.Active),
            createIdea(IdeaStatus.Draft),
            createIdea(IdeaStatus.Closed),
            createIdea(IdeaStatus.Closed),
        ]

        expect(filterIdeas(ideas, IdeaFilter.Closed)).toStrictEqual([ideas[0], ideas[3], ideas[4]])
    })
})

function createIdea(status: IdeaStatus): IdeaDto {
    return {
        status: status,
    } as IdeaDto
}
