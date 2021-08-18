import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { CreateIdeaNetworkDto } from '../dto/create-idea-network.dto'
import { createIdea } from '../spec.helpers'

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
        it(`should update idea network value`, async () => {
            const { idea, sessionHandler, ideaNetworkId } = await setUp([{ name: NETWORKS.POLKADOT, value: 10 }])

            await sessionHandler.authorizeRequest(
                request(app()).patch(`/api/v1/ideas/${idea.id}/networks/${ideaNetworkId}`).send({ value: 12 }),
            )

            const { body } = await request(app()).get(`/api/v1/ideas/${idea.id}`)
            expect(body.networks[0].value).toBe(12)
        })
    })
})
