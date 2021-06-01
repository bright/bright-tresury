import { filterIdeas } from './filterIdeas'
import { IdeaFilter } from './IdeaStatusFilters'
import { IdeaDto, IdeaStatus } from '../ideas.dto'
import { AuthContextUser } from '../../auth/AuthContext'

const createIdea = (status: IdeaStatus, user: AuthContextUser): IdeaDto => {
    return {
        ownerId: user.id,
        status: status,
    } as IdeaDto
}

describe('filter ideas', () => {
    let user: AuthContextUser
    let otherUser: AuthContextUser

    beforeAll(() => {
        user = {
            id: 'df03924f-a9d5-4920-bd40-a56ebfd1ae22',
        } as AuthContextUser

        otherUser = {
            id: 'f847a9de-e640-460a-bd1f-0eaeb4f6da5b',
        } as AuthContextUser
    })

    describe(`filter by ${IdeaFilter.All}`, () => {
        it('should return all ideas', () => {
            const ideas = [
                createIdea(IdeaStatus.Draft, user),
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.TurnedIntoProposalByMilestone, user),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.All, user)).toStrictEqual([
                ideas[0],
                ideas[1],
                ideas[2],
                ideas[3],
                ideas[4],
            ])
        })
    })

    describe(`filter by ${IdeaFilter.Mine}`, () => {
        it(`should return ideas owned by the given user`, () => {
            const ideas = [
                createIdea(IdeaStatus.Draft, user),
                createIdea(IdeaStatus.Active, otherUser),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.TurnedIntoProposalByMilestone, otherUser),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.Mine, user)).toStrictEqual([ideas[0], ideas[2], ideas[4]])
        })

        it('should not return ideas owned by other users', () => {
            const ideas = [
                createIdea(IdeaStatus.Draft, user),
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.TurnedIntoProposalByMilestone, user),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.Mine, otherUser)).toStrictEqual([])
        })
    })

    describe(`filter by ${IdeaFilter.Draft}`, () => {
        it(`should return ideas with ${IdeaStatus.Draft} status only`, () => {
            const ideas = [
                createIdea(IdeaStatus.Draft, user),
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.TurnedIntoProposalByMilestone, user),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.Draft, user)).toStrictEqual([ideas[0]])
        })
    })

    describe(`filter by ${IdeaFilter.Active}`, () => {
        it(`should return ideas with ${IdeaStatus.Active} status only`, () => {
            const ideas = [
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.Draft, user),
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.Active, user)).toStrictEqual([ideas[0], ideas[2]])
        })
    })

    describe(`filter by ${IdeaFilter.TurnedIntoProposal}`, () => {
        it(`should return ideas with ${IdeaStatus.TurnedIntoProposal} status only`, () => {
            const ideas = [
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.TurnedIntoProposal, user),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.TurnedIntoProposal, user)).toStrictEqual([
                ideas[1],
                ideas[2],
                ideas[3],
            ])
        })
    })

    describe(`filter by ${IdeaFilter.Closed}`, () => {
        it(`should return ideas only with ${IdeaStatus.Closed} status only`, () => {
            const ideas = [
                createIdea(IdeaStatus.Closed, user),
                createIdea(IdeaStatus.Active, user),
                createIdea(IdeaStatus.Draft, user),
                createIdea(IdeaStatus.Closed, user),
                createIdea(IdeaStatus.Closed, user),
            ]

            expect(filterIdeas(ideas, IdeaFilter.Closed, user)).toStrictEqual([ideas[0], ideas[3], ideas[4]])
        })
    })
})
