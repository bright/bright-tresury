import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { MilestoneDetails } from '../../milestone-details/entities/milestone-details.entity'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { createIdea, createSessionData } from '../spec.helpers'
import { IdeaMilestone } from './entities/idea-milestone.entity'
import { IdeaMilestoneStatus } from './entities/idea-milestone-status'
import { IdeaMilestonesRepository } from './idea-milestones.repository'

const createDetails = async (app: INestApplication, details?: Partial<MilestoneDetails>) => {
    details = details ?? {}
    const repository = app.get(getRepositoryToken(MilestoneDetails))
    const created = await repository.create({ ...details, subject: 'subject' })
    return repository.save(created)
}

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
            const ideaMilestone = new IdeaMilestone(idea, IdeaMilestoneStatus.Active, [], await createDetails(app()))

            const saved = await getRepository().save(ideaMilestone)

            const actual = await getRepository().findOne(saved.id)
            expect(actual).toBeDefined()
        })

        it('should assign consecutive ordinal numbers for one idea', async () => {
            const idea = await createIdea({}, sessionData)

            const ideaMilestone1 = new IdeaMilestone(idea, IdeaMilestoneStatus.Active, [], await createDetails(app()))
            const saved1 = await getRepository().save(ideaMilestone1)
            const actual1 = await getRepository().findOne(saved1.id)
            expect(actual1!.ordinalNumber).toBe(1)

            const ideaMilestone2 = new IdeaMilestone(idea, IdeaMilestoneStatus.Active, [], await createDetails(app()))
            const saved2 = await getRepository().save(ideaMilestone2)
            const actual2 = await getRepository().findOne(saved2.id)
            expect(actual2!.ordinalNumber).toBe(2)
        })

        it('should assign ordinal numbers for second idea starting with 1', async () => {
            // create first idea and a milestone
            const idea1 = await createIdea({}, sessionData)
            const ideaMilestone1 = new IdeaMilestone(idea1, IdeaMilestoneStatus.Active, [], await createDetails(app()))
            await getRepository().save(ideaMilestone1)

            const idea2 = await createIdea({}, sessionData)
            const ideaMilestone2 = new IdeaMilestone(idea2, IdeaMilestoneStatus.Active, [], await createDetails(app()))

            const saved2 = await getRepository().save(ideaMilestone2)

            const actual2 = await getRepository().findOne(saved2.id)
            expect(actual2!.ordinalNumber).toBe(1)
        })
    })
})
