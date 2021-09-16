import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { IdeaProposalDetails } from './idea-proposal-details.entity'
import { IdeaProposalDetailsService } from './idea-proposal-details.service'

describe('IdeaProposalDetailsService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeaProposalDetailsService)
    const getRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaProposalDetails>>(getRepositoryToken(IdeaProposalDetails)),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('create', () => {
        it('should create details with all valid data', async (done) => {
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
    })
    describe('update', () => {
        it('should return updated details', async () => {
            const details = await getService().create({ title: 'Test title' })

            const updatedDetails = (await getService().update(
                {
                    title: 'Test title updated',
                    content: 'content updated',
                    field: 'field updated',
                    contact: 'contact updated',
                    portfolio: 'portfolio updated',
                },
                details,
            ))!

            expect(updatedDetails.title).toBe('Test title updated')
            expect(updatedDetails.content).toBe('content updated')
            expect(updatedDetails.field).toBe('field updated')
            expect(updatedDetails.contact).toBe('contact updated')
            expect(updatedDetails.portfolio).toBe('portfolio updated')
        })

        it('should save updated details', async () => {
            const details = await getService().create({
                title: 'Test title',
            })

            await getService().update(
                {
                    title: 'Test title updated',
                    content: 'content updated',
                    field: 'field updated',
                    contact: 'contact updated',
                    portfolio: 'portfolio updated',
                },
                details,
            )

            const savedDetails = (await getRepository().findOne(details.id))!
            expect(savedDetails.title).toBe('Test title updated')
            expect(savedDetails.content).toBe('content updated')
            expect(savedDetails.field).toBe('field updated')
            expect(savedDetails.contact).toBe('contact updated')
            expect(savedDetails.portfolio).toBe('portfolio updated')
        })

        it('should save details with updated title and not updated other properties', async () => {
            const details = await getService().create({
                title: 'Test title',
                portfolio: 'Test portfolio',
            })

            await getService().update({ title: 'Test title updated' }, details)

            const savedDetails = (await getRepository().findOne(details.id))!
            expect(savedDetails.title).toBe('Test title updated')
            expect(savedDetails.portfolio).toBe('Test portfolio')
        })
        it('should update and save idea with updated links', async () => {
            const details = await getService().create({
                title: 'title',
                links: ['Test link'],
            })

            await getService().update({ links: ['New Link'] }, details)

            const savedDetails = (await getRepository().findOne(details.id))!
            expect(savedDetails.links).toBe(JSON.stringify(['New Link']))
        })
    })
})
