import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'
import { beforeSetupFullApp } from '../../../utils/spec.helpers'
import { v4 as uuid } from 'uuid'
import { CreateBlockchainUserDto } from '../../../users/dto/createBlockchainUser.dto'
import { Response } from 'express'
import { BadRequestException } from '@nestjs/common'
import { SignatureValidator } from '../signMessage/signature.validator'
import { cleanDatabases } from '../web3.spec.helper'
import { Web3AssociateService } from './web3-associate.service'
import { createUserSessionHandler } from '../../supertokens/specHelpers/supertokens.session.spec.helper'

describe(`Web3 Associate Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(Web3AssociateService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabases()
    })

    describe('start associate', () => {
        it('returns uuid', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress,
            } as CreateBlockchainUserDto)

            const signMessageResponse = await getService().startSignMessage({ address: bobAddress })
            expect(signMessageResponse.signMessage).toBeDefined()
        })
        it('is allowed with invalid address', async () => {
            const response = getService().startSignMessage({ address: uuid() })
            expect(response).toBeDefined()
        })
    })
    describe('confirm associate', () => {
        it('associates account', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)

            const sessionHandler = await createUserSessionHandler(app.get())
            await getService().startSignMessage({ address: bobAddress })
            await getService().confirmAssociateAddress(
                {
                    signature: uuid(),
                    address: bobAddress,
                },
                {} as Response,
                sessionHandler.sessionData,
            )

            const user = await getUsersService().findOne(sessionHandler.sessionData.user.id)
            expect(user.blockchainAddresses!.length).toBe(1)
        })
        it('throws bad request when signature is invalid', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => false)
            const sessionHandler = await createUserSessionHandler(app.get())
            await getService().startSignMessage({ address: bobAddress })

            await expect(
                getService().confirmAssociateAddress(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    {} as Response,
                    sessionHandler.sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })
})
