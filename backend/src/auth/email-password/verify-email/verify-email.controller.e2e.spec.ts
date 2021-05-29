import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp, cleanDatabase, request } from '../../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../../supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import { createEmailVerificationToken } from 'supertokens-node/lib/build/recipe/emailverification'
import { HttpStatus } from '@nestjs/common'

describe('VerifyEmailController', () => {
    const app = beforeSetupFullApp()

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('verify', () => {
        it('successfully verifies email with the correct token', async () => {
            const sessionHandler = await createUserSessionHandler(app())
            const user = sessionHandler.sessionData.user
            const token = await createEmailVerificationToken(user.authId, user.email)
            const response = await sessionHandler.authorizeRequest(
                request(app()).post(`/api/v1/auth/email-password/verify/${token}`).send(),
            )

            expect(response.statusCode).toBe(HttpStatus.OK)
        })
        it('fails to verify email with the wrong token', async () => {
            const sessionHandler = await createUserSessionHandler(app())
            const response = await sessionHandler.authorizeRequest(
                request(app()).post(`/api/v1/auth/email-password/verify/${uuid()}`).send(),
            )

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
        })
    })
})
