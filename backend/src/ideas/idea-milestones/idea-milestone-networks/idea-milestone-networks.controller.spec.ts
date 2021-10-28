import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../../utils/spec.helpers'
import { createIdea, createIdeaMilestone } from '../../spec.helpers'
import { CreateIdeaMilestoneNetworkDto } from '../dto/create-idea-milestone-network.dto'
import { IdeaMilestoneNetworkStatus } from '../entities/idea-milestone-network-status'
import { NetworkPlanckValue } from '../../../utils/types'

const baseUrl = (ideaId: string, milestoneId: string, id: string = '') =>
    `/api/v1/ideas/${ideaId}/milestones/${milestoneId}/networks/${id}`

describe('/api/v1/ideas/:ideaId/networks/:id', () => {
    const app = beforeSetupFullApp()

    const setUp = async (networks: CreateIdeaMilestoneNetworkDto[]) => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const idea = await createIdea({ networks }, sessionHandler.sessionData)
        const ideaMilestone = await createIdeaMilestone(idea.id, { networks }, sessionHandler.sessionData)
        const ideaMilestoneNetworkId = ideaMilestone.networks?.[0]?.id
        return { sessionHandler, idea, ideaMilestone, ideaMilestoneNetworkId }
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('PATCH :/id', () => {
        it(`should return ${HttpStatus.OK}`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId))
                        .send({ value: '12' }),
                )
                .expect(HttpStatus.OK)
        })

        it(`should return updated values`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId)).send({ value: '12' }),
            )

            expect(body.value).toBe('12')
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for negative value`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId))
                        .send({ value: -1 }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.OK} for zero value`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app()).patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId)).send({ value: '0' }),
                )
                .expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no value provided`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app()).patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId)).send({}),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { idea, ideaMilestone, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return request(app())
                .patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId))
                .send({})
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user request`, async () => {
            const { idea, ideaMilestone, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            const notAuthorized = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notAuthorized
                .authorizeRequest(
                    request(app()).patch(baseUrl(idea.id, ideaMilestone.id, ideaMilestoneNetworkId)).send({}),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('PATCH', () => {
        it(`should return ${HttpStatus.OK}`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id))
                        .send({ items: [{ id: ideaMilestoneNetworkId, value: '12' }] }),
                )
                .expect(HttpStatus.OK)
        })

        it(`should return updated values`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])
            const { body } = await sessionHandler.authorizeRequest(
                request(app())
                    .patch(baseUrl(idea.id, ideaMilestone.id))
                    .send({ items: [{ id: ideaMilestoneNetworkId, value: '12' }] }),
            )

            expect(body[0].value).toBe('12')
            expect(body[0].id).toBe(ideaMilestoneNetworkId)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for negative value`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id))
                        .send({ items: [{ id: ideaMilestoneNetworkId, value: -1 }] }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no value provided`, async () => {
            const { idea, ideaMilestone, sessionHandler, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id))
                        .send({ items: [{ id: ideaMilestoneNetworkId }] }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no id provided`, async () => {
            const { idea, ideaMilestone, sessionHandler } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id))
                        .send({ items: [{ value: '12' }] }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid uuid provided`, async () => {
            const { idea, ideaMilestone, sessionHandler } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id))
                        .send({ items: [{ id: 'not_valid_uuid', value: '12' }] }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { idea, ideaMilestone, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            return request(app())
                .patch(baseUrl(idea.id, ideaMilestone.id))
                .send({ items: [{ id: ideaMilestoneNetworkId, value: '12' }] })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user request`, async () => {
            const { idea, ideaMilestone, ideaMilestoneNetworkId } = await setUp([
                { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue , status: IdeaMilestoneNetworkStatus.Active },
            ])

            const notAuthorized = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notAuthorized
                .authorizeRequest(
                    request(app())
                        .patch(baseUrl(idea.id, ideaMilestone.id))
                        .send({ items: [{ id: ideaMilestoneNetworkId, value: '12' }] }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
