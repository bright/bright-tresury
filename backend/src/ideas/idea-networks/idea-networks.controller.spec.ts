import { HttpStatus } from '@nestjs/common'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { CreateIdeaNetworkDto } from '../dto/create-idea-network.dto'
import { createIdea } from '../spec.helpers'
import { NetworkPlanckValue } from '../../utils/types'

const baseUrl = (ideaId: string, id: string) => `/api/v1/ideas/${ideaId}/networks/${id}`

describe('/api/v1/ideas/:ideaId/networks/:id', () => {
    const app = beforeSetupFullApp()

    const setUp = async (networks: CreateIdeaNetworkDto[]) => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const idea = await createIdea({ networks }, sessionHandler.sessionData)
        const ideaNetworkId = idea.networks?.[0]?.id
        return { sessionHandler, idea, ideaNetworkId }
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('PATCH', () => {
        it(`should return ${HttpStatus.OK}`, async () => {
            const { idea, sessionHandler, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }])
            return sessionHandler
                .authorizeRequest(request(app()).patch(baseUrl(idea.id, ideaNetworkId)).send({ value: '12' }))
                .expect(HttpStatus.OK)
        })

        it(`should return updated values`, async () => {
            const { idea, sessionHandler, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }])
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).patch(baseUrl(idea.id, ideaNetworkId)).send({ value: '12' }),
            )

            expect(body.value).toBe('12')
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for negative value`, async () => {
            const { idea, sessionHandler, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }])

            return sessionHandler
                .authorizeRequest(request(app()).patch(baseUrl(idea.id, ideaNetworkId)).send({ value: -1 }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no value provided`, async () => {
            const { idea, sessionHandler, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }])

            return sessionHandler
                .authorizeRequest(request(app()).patch(baseUrl(idea.id, ideaNetworkId)).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { idea, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }])

            return request(app()).patch(baseUrl(idea.id, ideaNetworkId)).send({}).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user request`, async () => {
            const { idea, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }])

            const notAuthorized = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notAuthorized
                .authorizeRequest(request(app()).patch(baseUrl(idea.id, ideaNetworkId)).send({}))
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
