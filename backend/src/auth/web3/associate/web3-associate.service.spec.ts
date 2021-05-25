import {BadRequestException} from '@nestjs/common'
import {v4 as uuid} from 'uuid'
import {CreateBlockchainUserDto} from '../../../users/dto/create-blockchain-user.dto'
import {User} from "../../../users/user.entity";
import {UsersService} from '../../../users/users.service'
import {beforeSetupFullApp} from '../../../utils/spec.helpers'
import {createUserSessionHandler} from '../../supertokens/specHelpers/supertokens.session.spec.helper'
import {SuperTokensService} from '../../supertokens/supertokens.service'
import {SignatureValidator} from '../signMessage/signature.validator'
import {cleanDatabases} from '../web3.spec.helper'
import {Web3AssociateService} from './web3-associate.service'

describe(`Web3 Associate Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(Web3AssociateService)
    const getSignatureValidator = () => app.get().get(SignatureValidator)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    let user: User

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabases()

        user = await getUsersService().createBlockchainUser({
            authId: uuid(),
            username: bobUsername,
            blockchainAddress: bobAddress,
        } as CreateBlockchainUserDto)
    })

    describe('start associate', () => {
        it('returns uuid', async () => {
            const signMessageResponse = await getService().start({ address: bobAddress, password: '' }, user)
            expect(signMessageResponse.signMessage).toBeDefined()
        })
        it('is allowed with invalid address', async () => {
            const response = getService().start({ address: uuid(), password: '' }, user)
            expect(response).toBeDefined()
        })
    })
    describe('confirm associate', () => {
        it('associates account', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => true)

            const sessionHandler = await createUserSessionHandler(app.get())
            await getService().start({ address: bobAddress, password: '' }, user)
            await getService().confirm(
                {
                    signature: uuid(),
                    address: bobAddress,
                },
                sessionHandler.sessionData,
            )

            const actualUser = await getUsersService().findOne(sessionHandler.sessionData.user.id)
            expect(actualUser.blockchainAddresses!.length).toBe(1)
        })
        it('throws bad request when signature is invalid', async () => {
            jest.spyOn(getSignatureValidator(), 'validateSignature').mockImplementation((): boolean => false)
            const sessionHandler = await createUserSessionHandler(app.get())
            await getService().start({ address: bobAddress, password: '' }, user)

            await expect(
                getService().confirm(
                    {
                        signature: uuid(),
                        address: bobAddress,
                    },
                    sessionHandler.sessionData,
                ),
            ).rejects.toThrow(BadRequestException)
        })
    })
})
