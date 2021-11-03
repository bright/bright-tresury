import { BadRequestException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { CreateMilestoneDetailsDto } from './dto/create-milestone-details.dto'
import { MilestoneDetailsEntity } from './entities/milestone-details.entity'
import { MilestoneDetailsService } from './milestone-details.service'

describe('MilestoneDetailsService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(MilestoneDetailsService)
    const getRepository = () => app.get().get(getRepositoryToken(MilestoneDetailsEntity))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('create', () => {
        it('should create and save milestone details with all valid data', async () => {
            const details = await getService().create({
                subject: 'ideaMilestoneSubject',
                dateFrom: new Date(2021, 3, 20),
                dateTo: new Date(2021, 3, 21),
                description: 'ideaMilestoneDescription',
            })

            const savedDetails = await getRepository().findOne(details.id)

            expect(savedDetails.subject).toBe('ideaMilestoneSubject')
            expect(savedDetails.dateFrom).toBe('2021-04-20')
            expect(savedDetails.dateTo).toBe('2021-04-21')
            expect(savedDetails.description).toBe('ideaMilestoneDescription')
        })
        it('should throw bad request exception if start and end dates of milestone details are given and end date is prior to start date', async () => {
            await expect(
                getService().create({
                    subject: 'ideaMilestoneSubject',
                    dateFrom: new Date(2021, 3, 21),
                    dateTo: new Date(2021, 3, 20),
                }),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('update', () => {
        const createDetails = (details?: Partial<CreateMilestoneDetailsDto>) => {
            return getService().create({
                subject: 'ideaMilestoneSubject',
                dateFrom: new Date(2021, 3, 20),
                dateTo: new Date(2021, 3, 21),
                description: 'ideaMilestoneDescription',
                ...details,
            })
        }
        it('should throw bad request exception if updated end date of the milestone details is prior to start date', async () => {
            const details = await createDetails()

            await expect(getService().update({ dateTo: new Date(2021, 3, 19) }, details)).rejects.toThrow(
                BadRequestException,
            )
        })
        it('should update and save milestone details with updated dateFrom', async () => {
            const details = await createDetails({
                dateFrom: new Date(2021, 3, 20),
                dateTo: new Date(2021, 3, 21),
            })

            await getService().update({ dateFrom: new Date(2021, 3, 19) }, details)

            const updatedDetails = await getRepository().findOne(details.id)

            expect(updatedDetails.dateFrom).toBe('2021-04-19')
        })

        it('should update and save milestone details with updated dateTo', async () => {
            const details = await createDetails({
                dateFrom: new Date(2021, 3, 20),
                dateTo: new Date(2021, 3, 21),
            })

            await getService().update({ dateTo: new Date(2021, 3, 22) }, details)

            const updatedDetails = await getRepository().findOne(details.id)

            expect(updatedDetails.dateTo).toBe('2021-04-22')
        })

        it('should update and save idea milestone with updated description', async () => {
            const details = await createDetails({ description: 'ideaMilestoneDescription' })

            await getService().update({ description: 'Updated description' }, details)

            const updatedDetails = await getRepository().findOne(details.id)

            expect(updatedDetails.description).toBe('Updated description')
        })
    })

    describe('delete', () => {
        it('should delete details', async () => {
            const details = await getService().create({
                subject: 'Test subject',
            })

            await getService().delete(details)

            const deletedDetails = await getRepository().findOne(details.id)
            expect(deletedDetails).toBeUndefined()
        })
    })
})
