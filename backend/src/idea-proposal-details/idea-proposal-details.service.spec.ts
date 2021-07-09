import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../auth/session/session.decorator'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { IdeaProposalDetail } from './idea-proposal-detail.entity'
import { IdeaProposalDetailsService } from './idea-proposal-details.service'

describe('IdeaProposalDetailsService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeaProposalDetailsService)
    const getRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaProposalDetail>>(getRepositoryToken(IdeaProposalDetail)),
    )

    let sessionData: SessionData
    let otherSessionData: SessionData

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionData = await createSessionData()
        otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })
    })

    describe('create', () => {
        it('should create and save details with all valid data', async (done) => {
            const createdDetails = await getService().create({
                title: 'Test title',
                content: 'Test content',
                field: 'Test field',
                contact: 'Test contact',
                portfolio: 'Test portfolio',
                links: ['Test link'],
            })
            const savedDetails = (await getRepository().findOne(createdDetails.id))!
            expect(savedDetails.title).toBe('Test title')
            expect(savedDetails.content).toBe('Test content')
            expect(savedDetails.field).toBe('Test field')
            expect(savedDetails.contact).toBe('Test contact')
            expect(savedDetails.portfolio).toBe('Test portfolio')
            expect(savedDetails.links).toEqual(JSON.stringify(['Test link']))
            done()
        })
    }),
        describe('update', () => {
            //     it('should update and return details with updated title', async () => {
            //         const details = await getService().create({ title: 'Test title' })
            //         const updatedDetails = await getService().update({ title: 'Test title updated' })
            //         expect(updatedDetails.title).toBe('Test title updated')
            //     })
            //
            //     it('should update and save details with updated title and not updated other properties', async () => {
            //         const details = await getService().create({
            //             title: 'Test title',
            //             portfolio: 'Test portfolio',
            //         })
            //         await getService().update({ title: 'Test title updated' }, details.id)
            //
            //         const savedDetails = (await getRepository().findOne(details.id))!
            //         expect(savedDetails.title).toBe('Test title updated')
            //         expect(savedDetails.portfolio).toBe('Test portfolio')
            //     })
            //     it('should update and save idea with updated links', async () => {
            //         const details = await getService().create({
            //             title: 'title',
            //             links: ['Test link'],
            //         })
            //         await getService().update({ details: { links: ['New Link'] } }, idea.id, sessionData)
            //         const savedIdea = await getService().findOne(idea.id, sessionData)
            //         expect(savedIdea.details.links).toBe(JSON.stringify(['New Link']))
            //     })
        })
})
