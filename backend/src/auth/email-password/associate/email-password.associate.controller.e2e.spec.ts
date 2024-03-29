import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp, cleanDatabase, request } from '../../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import { createWeb3SessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { SignatureValidator } from '../../web3/signMessage/signature.validator'

describe('EmailPasswordAssociateController', () => {
    const app = beforeSetupFullApp()
    const getSignatureValidator = () => app.get().get(SignatureValidator)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        /**
         * Mock signature validation so that we don't use real blockchain for signing.
         */
        jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('associate', () => {
        it('should enable sign in with email-password', async () => {
            const sessionHandler = await createWeb3SessionHandler(app(), bobAddress)
            const password = uuid()

            await sessionHandler.authorizeRequest(
                request(app())
                    .post('/api/v1/auth/email-password/associate/start')
                    .send({
                        address: bobAddress,
                        details: {
                            email: 'bob@example.com',
                            username: 'bob',
                            password,
                        },
                    }),
            )
            await sessionHandler.authorizeRequest(
                request(app())
                    .post('/api/v1/auth/email-password/associate/confirm')
                    .send({
                        address: bobAddress,
                        signature: uuid(),
                        details: {
                            email: 'bob@example.com',
                            username: 'bob',
                            password,
                        },
                    }),
            )

            await sessionHandler.revoke()

            const response = await request(app())
                .post('/api/v1/auth/signin')
                .send({
                    formFields: [
                        {
                            id: 'email',
                            value: 'bob@example.com',
                        },
                        {
                            id: 'password',
                            value: password,
                        },
                    ],
                })
            expect(response.status).toBe(200)
            expect(response.body.status).toBe('OK')
            expect(response.body.user.email).toBe('bob@example.com')
        })
    })
})
