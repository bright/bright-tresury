import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {UsersService} from "../../users/users.service";
import {cleanAuthorizationDatabase, getAuthUser} from "../supertokens/specHelpers/supertokens.database.spec.helper";
import {AuthWeb3Service} from "./auth-web3.service";
import {v4 as uuid} from "uuid";
import {BadRequestException, ConflictException, NotFoundException} from "@nestjs/common";
import {CreateBlockchainUserDto} from "../../users/dto/createBlockchainUser.dto";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {Response} from "express";

describe(`Auth Web3 Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(AuthWeb3Service)
    const getUsersService = () => app.get().get(UsersService)
    const getSuperTokensService = () => app.get().get(SuperTokensService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'

    beforeEach(async () => {
        jest.spyOn(getSuperTokensService(), 'createSession').mockImplementation(() => Promise.resolve({} as any))

        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('web3 start sign up', () => {
        it('start signup returns uuid', async () => {
            const signMessageResponse = await getService().startSignUp({address: bobAddress})
            expect(signMessageResponse.signMessage).toBeDefined()
        })
        it('start signup throws bad request if invalid address', async () => {
            await expect(getService().startSignUp({address: uuid()}))
                .rejects
                .toThrow(BadRequestException)
        })
        it('start signup throws conflict if user with this address exists', async () => {
            await getUsersService().createBlockchainUser({
                authId: uuid(),
                username: bobUsername,
                blockchainAddress: bobAddress
            } as CreateBlockchainUserDto)
            await expect(getService().startSignUp({address: bobAddress}))
                .rejects
                .toThrow(ConflictException)
        })
    })
    describe('web3 start sign up', () => {
        it('confirm signup saves user', async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignUp({address: bobAddress})
            await getService().confirmSignUp({
                signature: uuid(),
                network: 'localhost',
                address: bobAddress
            }, {} as Response)

            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)
            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
        })
        it("confirm signup with address that didn't start sign up throws not found", async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignUp({address: bobAddress})
            await expect(getService().confirmSignUp({
                    signature: uuid(),
                    network: 'localhost',
                    address: aliceAddress
                }, {} as Response)
            ).rejects.toThrow(NotFoundException)
        })
        it("confirm signup with invalid signature throws bad request", async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => false)
            await getService().startSignUp({address: bobAddress})
            await expect(getService().confirmSignUp({
                    signature: uuid(),
                    network: 'localhost',
                    address: bobAddress
                }, {} as Response)
            ).rejects.toThrow(BadRequestException)
        })
    })
})
