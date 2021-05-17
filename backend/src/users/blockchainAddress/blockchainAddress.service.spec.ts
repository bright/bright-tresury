import { getRepositoryToken } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { BlockchainAddressService } from './blockchainAddress.service'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { BlockchainAddress } from './blockchainAddress.entity'
import { User } from '../user.entity'
import { UsersService } from '../users.service'
import { CreateUserDto } from '../dto/createUser.dto'

describe(`Blockchain Address Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(BlockchainAddressService)
    const getUserService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(BlockchainAddress))

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'

    let user: User

    beforeEach(async () => {
        await cleanDatabase()
        user = await getUserService().create({
            authId: uuid(),
            username: 'Bob',
            email: 'bob@email.com',
        } as CreateUserDto)
    })

    describe('create', () => {
        it('should return blockchain address', async () => {
            const blockchainAddress = await getService().create(new BlockchainAddress(bobAddress, user, true))
            expect(blockchainAddress).toBeDefined()
            expect(blockchainAddress.address).toBe(bobAddress)
        })
        it('should save blockchain address', async () => {
            const blockchainAddress = await getService().create(new BlockchainAddress(bobAddress, user, true))
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
            await getService().create(new BlockchainAddress(bobAddress, user, true))

            const doesAddressExist = await getService().doesAddressExist(bobAddress)
            expect(doesAddressExist).toBe(true)
        })
    })

    describe('find by user id', () => {
        it('should return addresses belonging to the user', async () => {
            const address1 = await getService().create(new BlockchainAddress(bobAddress, user, true))
            const address2 = await getService().create(new BlockchainAddress(aliceAddress, user, false))

            const addresses = await getService().findByUserId(user.id)
            expect(addresses.length).toBe(2)

            const addressIds = addresses.map((address) => address.id)
            expect(addressIds).toContain(address1.id)
            expect(addressIds).toContain(address2.id)
        })
        it('should return no addresses', async () => {
            const addresses = await getService().findByUserId(user.id)
            expect(addresses.length).toBe(0)
        })
        it('should not return addresses of another user', async () => {
            const addressBobUser = await getService().create(new BlockchainAddress(bobAddress, user, true))
            const aliceUser = await getUserService().create({
                authId: uuid(),
                username: 'Alice',
                email: 'alice@email.com',
            } as CreateUserDto)
            const addressAliceUser = await getService().create(new BlockchainAddress(aliceAddress, aliceUser, true))

            const addresses = await getService().findByUserId(user.id)
            expect(addresses.length).toBe(1)

            const addressIds = addresses.map((address) => address.id)
            expect(addressIds).toContain(addressBobUser.id)
            expect(addressIds).not.toContain(addressAliceUser.id)
        })
    })
})
