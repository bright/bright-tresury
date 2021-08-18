import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../../utils/spec.helpers'
import { createIdea, createIdeaMilestone } from '../../spec.helpers'
import { CreateIdeaMilestoneNetworkDto } from '../dto/create-idea-milestone-network.dto'

describe('/api/v1/ideas/:ideaId/networks/:id', () => {
    const app = beforeSetupFullApp()

    const setUp = async (networks: CreateIdeaMilestoneNetworkDto[]) => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const idea = await createIdea({ networks }, sessionHandler.sessionData)
        const ideaMilestone = await createIdeaMilestone(idea.id, { networks }, sessionHandler.sessionData)
        const ideaMilestoneNetworkId = ideaMilestone.networks?.[0]?.id
        return { sessionHandler, idea, ideaMilestoneNetworkId, ideaMilestone }
    }

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('PATCH', () => {
        it(`should update idea milestone network value`, async () => {
            const { idea, sessionHandler, ideaMilestoneNetworkId, ideaMilestone } = await setUp([
                { name: NETWORKS.POLKADOT, value: 10 },
            ])

            await sessionHandler.authorizeRequest(
                request(app())
                    .patch(`/api/v1/ideas/${idea.id}/milestones/${ideaMilestone.id}/networks/${ideaMilestoneNetworkId}`)
                    .send({ value: 12 }),
            )

            const { body } = await request(app()).get(`/api/v1/ideas/${idea.id}/milestones/${ideaMilestone.id}`)
            expect(body.networks[0].value).toBe(12)
        })
    })
})
