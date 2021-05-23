import {v4 as uuid} from 'uuid'
import {beforeSetupFullApp, cleanDatabase, request} from "../../../utils/spec.helpers";
import {cleanAuthorizationDatabase} from "../../supertokens/specHelpers/supertokens.database.spec.helper";
import {
    createBlockchainSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler
} from "../../supertokens/specHelpers/supertokens.session.spec.helper";
import {SignatureValidator} from "../../web3/signMessage/signature.validator";

describe('EmailPasswordAssociateController', () => {
    const app = beforeSetupFullApp()
    const getSignatureValidator = () => app.get().get(SignatureValidator)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    let sessionHandler: SessionHandler
    let otherSessionHandler: SessionHandler

    beforeEach(async () => {
        /**
         * Mock signature validation so that we don't use real blockchain for signing.
         */
        jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionHandler = await createBlockchainSessionHandler(app(), bobAddress)
        otherSessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
    })

    const details = {
        email: 'bob@example.com',
        username: 'bob',
        password: uuid()
    }

    describe('start', () => {
        it('should return 200 for valid data', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/start').send({
                    address: bobAddress,
                    details
                }),
            ).expect(200)
        })

        it.skip('should return bad request for not own address', async () => {
            // TODO this test fails, need to change the sign message service
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/start').send({
                    address: bobAddress,
                    details
                }),
            ).expect(400)
        })

        it('should return bad request for empty details', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/start').send({
                    address: bobAddress,
                    details: {}
                }),
            ).expect(400)
        })

        it('should return conflict for already existing email', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/start').send({
                    address: bobAddress,
                    details: {
                        ...details,
                        email: otherSessionHandler.sessionData.user.email
                    }
                }),
            ).expect(409)
        })

        it('should return conflict for already existing username', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/start').send({
                    address: bobAddress,
                    details: {
                        ...details,
                        username: otherSessionHandler.sessionData.user.username
                    }
                }),
            ).expect(409)
        })

        it('should return forbidden for not authorized request', async () => {
            request(app()).post('/api/v1/auth/email-password/associate/start').send({
                    address: bobAddress,
                    details
                },
            ).expect(403)
        })
    })

    describe('confirm', () => {
        it('should return 200 for valid data', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/confirm').send({
                    signature: uuid(),
                    address: bobAddress,
                    details
                }),
            ).expect(200)
        })

        it('should return bad request for not own address', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/confirm').send({
                    signature: uuid(),
                    address: bobAddress,
                    details
                }),
            ).expect(400)
        })

        it('should return bad request for empty details', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/confirm').send({
                    signature: uuid(),
                    address: bobAddress,
                    details: {}
                }),
            ).expect(400)
        })

        it('should return conflict for already existing email', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/confirm').send({
                    signature: uuid(),
                    address: bobAddress,
                    details: {
                        ...details,
                        email: otherSessionHandler.sessionData.user.email
                    }
                }),
            ).expect(409)
        })

        it('should return conflict for already existing username', async () => {
            await sessionHandler.authorizeRequest(
                request(app()).post('/api/v1/auth/email-password/associate/confirm').send({
                    signature: uuid(),
                    address: bobAddress,
                    details: {
                        ...details,
                        username: otherSessionHandler.sessionData.user.username
                    }
                }),
            ).expect(409)
        })

        it('should return forbidden for not authorized request', async () => {
            request(app()).post('/api/v1/auth/email-password/associate/confirm').send({
                    signature: uuid(),
                    address: bobAddress,
                    details
                },
            ).expect(403)
        })
    })
});
