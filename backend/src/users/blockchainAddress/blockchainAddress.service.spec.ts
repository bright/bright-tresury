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
        it('should create blockchain address', async () => {
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

    describe('validate address', () => {
        it('not existing proper address is valid', async () => {
            const isValid = await getService().validateAddress(bobAddress)
            expect(isValid).toBe(true)
        })
        it('already existing address is not valid', async () => {
            await getService().create(new BlockchainAddress(
                bobAddress,
                user,
                true
            ))

            const isValid = await getService().validateAddress(bobAddress)
            expect(isValid).toBe(false)
        })
        it('invalid address is not valid', async () => {
            const isValid = await getService().validateAddress(uuid())
            expect(isValid).toBe(false)
        })
    })

})
