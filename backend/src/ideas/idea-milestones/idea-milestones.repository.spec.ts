import { SessionData } from '../../auth/session/session.decorator'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { createIdea, createSessionData } from '../spec.helpers'
import { IdeaMilestone } from './entities/idea-milestone.entity'
import { IdeaMilestoneStatus } from './idea-milestone-status'
import { IdeaMilestonesRepository } from './idea-milestones.repository'

describe(`IdeaMilestonesRepository`, () => {
    const app = beforeSetupFullApp()

    const getRepository = () => app.get().get(IdeaMilestonesRepository)

    let sessionData: SessionData

    beforeEach(async () => {
        await cleanDatabase()

        sessionData = await createSessionData()
    })

    describe('save', () => {
        it('should save the milestone', async () => {
            const idea = await createIdea({}, sessionData)
            const ideaMilestone = new IdeaMilestone(idea, 'subject', IdeaMilestoneStatus.Active, [])

            const saved = await getRepository().save(ideaMilestone)

            const actual = await getRepository().findOne(saved.id)
            expect(actual).toBeDefined()
        })

        it('should assign consecutive ordinal numbers for one idea', async () => {
            const idea = await createIdea({}, sessionData)

            const ideaMilestone1 = new IdeaMilestone(idea, 'subject', IdeaMilestoneStatus.Active, [])
            const saved1 = await getRepository().save(ideaMilestone1)
            const actual1 = await getRepository().findOne(saved1.id)
            expect(actual1!.ordinalNumber).toBe(1)

            const ideaMilestone2 = new IdeaMilestone(idea, 'subject', IdeaMilestoneStatus.Active, [])
            const saved2 = await getRepository().save(ideaMilestone2)
            const actual2 = await getRepository().findOne(saved2.id)
            expect(actual2!.ordinalNumber).toBe(2)
        })

        it('should assign ordinal numbers for second idea starting with 1', async () => {
            // create first idea and a milestone
            const idea1 = await createIdea({}, sessionData)
            const ideaMilestone1 = new IdeaMilestone(idea1, 'subject', IdeaMilestoneStatus.Active, [])
            await getRepository().save(ideaMilestone1)

            const idea2 = await createIdea({}, sessionData)
            const ideaMilestone2 = new IdeaMilestone(idea2, 'subject', IdeaMilestoneStatus.Active, [])

            const saved2 = await getRepository().save(ideaMilestone2)

            const actual2 = await getRepository().findOne(saved2.id)
            expect(actual2!.ordinalNumber).toBe(1)
        })
    })
})
