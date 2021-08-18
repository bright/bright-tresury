import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { CreateIdeaNetworkDto } from '../dto/create-idea-network.dto'
import { IdeaNetworkStatus } from '../entities/idea-network-status'
import { IdeaNetwork } from '../entities/idea-network.entity'
import { createIdea, createSessionData } from '../spec.helpers'
import { IdeaNetworksService } from './idea-networks.service'
import { v4 as uuid } from 'uuid'

describe('IdeaNetworksService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(IdeaNetworksService)
    const getRepository = () => app().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork))

    const setUp = async (networks: CreateIdeaNetworkDto[]) => {
        const sessionData = await createSessionData()
        const idea = await createIdea({ networks }, sessionData)
        return { sessionData, idea }
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('update', () => {
        it('should update networks value', async () => {
            const { idea, sessionData } = await setUp([{ name: NETWORKS.KUSAMA, value: 10 }])
            const ideaNetworkId = idea.networks[0].id

            await getService().update(ideaNetworkId, { value: 5 }, sessionData)

            const savedIdeaNetwork = (await getRepository().findOne(ideaNetworkId))!
            expect(savedIdeaNetwork.value).toBe('5.000000000000000')
        })

        it(`should throw forbidden exception when trying to update network of other user's idea`, async () => {
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })

            const { idea } = await setUp([{ name: NETWORKS.KUSAMA, value: 10 }])
            const ideaNetworkId = idea.networks[0].id

            await expect(getService().update(ideaNetworkId, { value: 5 }, otherSessionData)).rejects.toThrow(
                ForbiddenException,
            )
        })

        it(`should throw not found exception when trying to update not existing network`, async () => {
            const { sessionData } = await setUp([{ name: NETWORKS.KUSAMA, value: 10 }])

            await expect(getService().update(uuid(), { value: 5 }, sessionData)).rejects.toThrow(NotFoundException)
        })

        it(`should throw forbidden exception when trying to update network with ${IdeaNetworkStatus.TurnedIntoProposal} status`, async () => {
            const { idea, sessionData } = await setUp([{ name: NETWORKS.KUSAMA, value: 10 }])
            const ideaNetworkId = idea.networks[0].id
            await getRepository().save({ id: ideaNetworkId, status: IdeaNetworkStatus.TurnedIntoProposal })

            await expect(getService().update(ideaNetworkId, { value: 5 }, sessionData)).rejects.toThrow(
                ForbiddenException,
            )
        })

        it(`should resolve when trying to update network with ${IdeaNetworkStatus.Pending} status`, async () => {
            const { idea, sessionData } = await setUp([{ name: NETWORKS.KUSAMA, value: 10 }])
            const ideaNetworkId = idea.networks[0].id
            await getRepository().save({ id: ideaNetworkId, status: IdeaNetworkStatus.Pending })

            await expect(getService().update(ideaNetworkId, { value: 5 }, sessionData)).resolves.toBeDefined()
        })

        it(`should resolve when trying to update network with ${IdeaNetworkStatus.Active} status`, async () => {
            const { idea, sessionData } = await setUp([{ name: NETWORKS.KUSAMA, value: 10 }])
            const ideaNetworkId = idea.networks[0].id
            await getRepository().save({ id: ideaNetworkId, status: IdeaNetworkStatus.Active })

            await expect(getService().update(ideaNetworkId, { value: 5 }, sessionData)).resolves.toBeDefined()
        })
    })
})
