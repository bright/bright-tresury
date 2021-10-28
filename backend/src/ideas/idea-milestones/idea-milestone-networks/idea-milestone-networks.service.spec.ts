import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { IdeaStatus } from '../../entities/idea-status'
import { createIdeaMilestone } from '../../spec.helpers'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { CreateIdeaMilestoneNetworkDto } from '../dto/create-idea-milestone-network.dto'
import { IdeaMilestoneNetworkStatus } from '../entities/idea-milestone-network-status'
import { IdeaMilestoneNetwork } from '../entities/idea-milestone-network.entity'
import { createIdea, createSessionData } from '../../spec.helpers'
import { IdeaMilestoneNetworksService } from './idea-milestone-networks.service'
import { Idea } from '../../entities/idea.entity'
import { NetworkPlanckValue } from '../../../utils/types'

describe('IdeaMilestoneNetworksService', () => {
    const app = beforeSetupFullApp()
    const getService = () => app().get(IdeaMilestoneNetworksService)
    const getRepository = () => app().get<Repository<IdeaMilestoneNetwork>>(getRepositoryToken(IdeaMilestoneNetwork))
    const getIdeasRepository = () => app().get<Repository<Idea>>(getRepositoryToken(Idea))

    const setUp = async (networks: CreateIdeaMilestoneNetworkDto[]) => {
        const sessionData = await createSessionData()
        const idea = await createIdea({ networks }, sessionData)
        const ideaMilestone = await createIdeaMilestone(idea.id, { networks }, sessionData)
        const ideaMilestoneNetworkId = ideaMilestone.networks[0].id
        return {
            sessionData,
            idea,
            ideaMilestone,
            ideaMilestoneNetworks: ideaMilestone.networks,
            ideaMilestoneNetworkId,
        }
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('update', () => {
        it('should update networks value', async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            await getService().update(ideaMilestoneNetworkId, { value: '5' as NetworkPlanckValue }, sessionData)

            const savedNetwork = (await getRepository().findOne(ideaMilestoneNetworkId))!
            expect(savedNetwork.value).toBe('5')
        })

        it(`should throw forbidden exception when trying to update network of other user's idea`, async () => {
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })

            const { ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            await expect(getService().update(ideaMilestoneNetworkId, { value: '5' as NetworkPlanckValue }, otherSessionData)).rejects.toThrow(
                ForbiddenException,
            )
        })

        it(`should throw not found exception when trying to update not existing network`, async () => {
            const { sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            await expect(getService().update(uuid(), { value: '5' as NetworkPlanckValue }, sessionData)).rejects.toThrow(NotFoundException)
        })

        it(`should throw BadRequestException when trying to update network with ${IdeaMilestoneNetworkStatus.TurnedIntoProposal} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getRepository().save({
                id: ideaMilestoneNetworkId,
                status: IdeaMilestoneNetworkStatus.TurnedIntoProposal,
            })

            await expect(getService().update(ideaMilestoneNetworkId, { value: '5' as NetworkPlanckValue }, sessionData)).rejects.toThrow(
                BadRequestException,
            )
        })

        it(`should resolve when trying to update network with ${IdeaMilestoneNetworkStatus.Pending} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getRepository().save({ id: ideaMilestoneNetworkId, status: IdeaMilestoneNetworkStatus.Pending })

            await expect(getService().update(ideaMilestoneNetworkId, { value: '5' as NetworkPlanckValue }, sessionData)).resolves.toBeDefined()
        })

        it(`should resolve when trying to update network with ${IdeaMilestoneNetworkStatus.Active} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getRepository().save({ id: ideaMilestoneNetworkId, status: IdeaMilestoneNetworkStatus.Active })

            await expect(getService().update(ideaMilestoneNetworkId, { value: '5' as NetworkPlanckValue }, sessionData)).resolves.toBeDefined()
        })

        it(`should throw BadRequestException when trying to update network of idea with ${IdeaStatus.TurnedIntoProposal} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData, idea } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getIdeasRepository().save({ id: idea.id, status: IdeaStatus.TurnedIntoProposal })

            await expect(getService().update(ideaMilestoneNetworkId, { value: '5' as NetworkPlanckValue }, sessionData)).rejects.toThrow(
                BadRequestException,
            )
        })
    })
    describe('updateMultiple', () => {
        it('should update networks values', async () => {
            const { ideaMilestoneNetworks, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
                { name: NETWORKS.POLKADOT, value: '8' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            await getService().updateMultiple(
                {
                    items: [
                        { id: ideaMilestoneNetworks[0].id, value: '12' as NetworkPlanckValue },
                        { id: ideaMilestoneNetworks[1].id, value: '14' as NetworkPlanckValue },
                    ],
                },
                sessionData,
            )

            const savedNetworks = await getRepository().findByIds(ideaMilestoneNetworks.map(({ id }) => id))
            expect(savedNetworks.find((n) => n.id === ideaMilestoneNetworks[0].id)!.value).toBe('12')
            expect(savedNetworks.find((n) => n.id === ideaMilestoneNetworks[1].id)!.value).toBe('14')
        })

        it('should return milestone networks', async () => {
            const { ideaMilestoneNetworks, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
                { name: NETWORKS.POLKADOT, value: '8' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            const returnedNetworks = await getService().updateMultiple(
                {
                    items: [
                        { id: ideaMilestoneNetworks[0].id, value: '12' as NetworkPlanckValue },
                        { id: ideaMilestoneNetworks[1].id, value: '14' as NetworkPlanckValue },
                    ],
                },
                sessionData,
            )
            expect(returnedNetworks).toHaveLength(2)
            expect(returnedNetworks[0].value).toBe('12')
            expect(returnedNetworks[1].value).toBe('14')
        })

        it('should ignore not existing network ids', async () => {
            const { ideaMilestoneNetworks, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            const returnedNetworks = await getService().updateMultiple(
                {
                    items: [
                        { id: ideaMilestoneNetworks[0].id, value: '12' as NetworkPlanckValue },
                        { id: uuid(), value: '14' as NetworkPlanckValue },
                    ],
                },
                sessionData,
            )

            expect(returnedNetworks).toHaveLength(1)
            expect(returnedNetworks[0].value).toBe('12')
        })

        it(`should throw BadRequestException when trying to update network with ${IdeaMilestoneNetworkStatus.TurnedIntoProposal} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getRepository().save({
                id: ideaMilestoneNetworkId,
                status: IdeaMilestoneNetworkStatus.TurnedIntoProposal,
            })

            await expect(
                getService().updateMultiple(
                    {
                        items: [{ id: ideaMilestoneNetworkId, value: '12' as NetworkPlanckValue }],
                    },
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should resolve when trying to update network with ${IdeaMilestoneNetworkStatus.Pending} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getRepository().save({ id: ideaMilestoneNetworkId, status: IdeaMilestoneNetworkStatus.Pending })

            await expect(
                getService().updateMultiple(
                    {
                        items: [{ id: ideaMilestoneNetworkId, value: '12' as NetworkPlanckValue }],
                    },
                    sessionData,
                ),
            ).resolves.toBeDefined()
        })

        it(`should resolve when trying to update network with ${IdeaMilestoneNetworkStatus.Active} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getRepository().save({ id: ideaMilestoneNetworkId, status: IdeaMilestoneNetworkStatus.Active })

            await expect(
                getService().updateMultiple(
                    {
                        items: [{ id: ideaMilestoneNetworkId, value: '12' as NetworkPlanckValue }],
                    },
                    sessionData,
                ),
            ).resolves.toBeDefined()
        })

        it(`should throw BadRequestException when trying to update network of idea with ${IdeaStatus.TurnedIntoProposal} status`, async () => {
            const { ideaMilestoneNetworkId, sessionData, idea } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])
            await getIdeasRepository().save({ id: idea.id, status: IdeaStatus.TurnedIntoProposal })

            await expect(
                getService().updateMultiple(
                    {
                        items: [{ id: ideaMilestoneNetworkId, value: '12' as NetworkPlanckValue }],
                    },
                    sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })

        it(`should throw forbidden exception when trying to update network of other user's idea`, async () => {
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })

            const { ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue, status: IdeaMilestoneNetworkStatus.Active },
            ])

            await expect(
                getService().updateMultiple(
                    {
                        items: [{ id: ideaMilestoneNetworkId, value: '12' as NetworkPlanckValue }],
                    },
                    otherSessionData,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })
})
