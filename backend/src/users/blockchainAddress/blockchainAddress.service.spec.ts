import {getRepositoryToken} from "@nestjs/typeorm";
import {v4 as uuid} from 'uuid';
import {BlockchainAddressService} from "./blockchainAddress.service";
import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {BlockchainAddress} from "./blockchainAddress.entity";
import {User} from "../user.entity";
import {UsersService} from "../users.service";
import {CreateUserDto} from "../dto/createUser.dto";

describe(`Users Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(BlockchainAddressService)
    const getUserService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(BlockchainAddress))

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    let user: User

    beforeEach(async () => {
        await cleanDatabase()
        user = await getUserService().create({
            authId: uuid(),
            username: 'Bob',
            email: 'bob@email.com'
        } as CreateUserDto)
    })

    describe('create user', () => {
        it('should return blockchain address', async () => {
            const blockchainAddress = await getService().create(new BlockchainAddress(
                bobAddress,
                user,
                true
            ))
            expect(blockchainAddress).toBeDefined()
            expect(blockchainAddress.address).toBe(bobAddress)
        })
        it('should save blockchain address', async () => {
            const blockchainAddress = await getService().create(new BlockchainAddress(
                bobAddress,
                user,
                true
            ))
            const savedBlockchainAddress = await getRepository().findOne(blockchainAddress.id)
            expect(savedBlockchainAddress).toBeDefined()
            expect(savedBlockchainAddress.address).toBe(bobAddress)
        })
    })

    describe('doesAddressExist', () => {
        it('should return false if address does not exists', async () => {
            const doesAddressExist = await getService().doesAddressExist(bobAddress)
            expect(doesAddressExist).toBe(false)
        })
        it('should return true if address exists', async () => {
            await getService().create(new BlockchainAddress(
                bobAddress,
                user,
                true
            ))

            const doesAddressExist = await getService().doesAddressExist(bobAddress)
            expect(doesAddressExist).toBe(true)
        })
    })

})
