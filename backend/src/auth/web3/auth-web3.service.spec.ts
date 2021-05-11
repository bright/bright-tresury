import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {UsersService} from "../../users/users.service";
import {cleanAuthorizationDatabase, getAuthUser} from "../supertokens/specHelpers/supertokens.database.spec.helper";
import {AuthWeb3Service} from "./auth-web3.service";
import {v4 as uuid, validate} from "uuid";
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
        it('should return uuid', async () => {
            const signMessageResponse = await getService().startSignUp({address: bobAddress})
            const isUuid = validate(signMessageResponse.signMessage)
            expect(isUuid).toBeTruthy()
        })
        it('should throw bad request if requested address is invalid', async () => {
            await expect(getService().startSignUp({address: uuid()}))
                .rejects
                .toThrow(BadRequestException)
        })
        it('should throw conflict if user with this address exists', async () => {
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
    describe('web3 confirm sign up', () => {
        it('should save users', async () => {
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
        it("should throw a not found if address didn't start sign up", async () => {
            jest.spyOn(getService(), 'validateSignature').mockImplementation((): boolean => true)
            await getService().startSignUp({address: bobAddress})
            await expect(getService().confirmSignUp({
                    signature: uuid(),
                    network: 'localhost',
                    address: aliceAddress
                }, {} as Response)
            ).rejects.toThrow(NotFoundException)
        })
        it("should throw a bad request if requested signature is invalid", async () => {
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
