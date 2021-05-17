import { getRepositoryToken } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { BlockchainAddressService } from './blockchainAddress.service'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { BlockchainAddress } from './blockchainAddress.entity'
import { User } from '../user.entity'
import { UsersService } from '../users.service'
import { CreateUserDto } from '../dto/createUser.dto'
import { BadRequestException, ConflictException } from '@nestjs/common'

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
        it('should throw conflict exception if primary address already exist', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            await expect(getService().create(new BlockchainAddress(aliceAddress, user, true))).rejects.toThrow(
                ConflictException,
            )
        })
        it('should throw conflict exception for secondary address if there is no primary address', async () => {
            await expect(getService().create(new BlockchainAddress(aliceAddress, user, false))).rejects.toThrow(
                BadRequestException,
            )
        })
        it('should allow creating secondary address if primary address already exist', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            const secondaryAddress = await getService().create(new BlockchainAddress(aliceAddress, user, false))
            expect(secondaryAddress).toBeDefined()
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

    describe('delete', () => {
        it('throw bad request exception if address is primary', async () => {
            const primaryAddress = await getService().create(new BlockchainAddress(bobAddress, user, true))
            await getService().create(new BlockchainAddress(aliceAddress, user, false))
            await expect(getService().deleteAddress(primaryAddress)).rejects.toThrow(BadRequestException)
        })
        it('removes secondary address', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            const secondaryAddress = await getService().create(new BlockchainAddress(aliceAddress, user, false))
            await getService().deleteAddress(secondaryAddress)

            const addresses = await getService().findByUserId(user.id)
            expect(addresses.length).toBe(1)

            const address = await getRepository().findOne(secondaryAddress)
            expect(address).toBeUndefined()
        })
    })

    describe('has any address', () => {
        it('returns true if there is an address', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            const hasAnyAddresses = await getService().hasAnyAddresses(user.id)
            expect(hasAnyAddresses).toBeTruthy()
        })
        it('returns true if there are multiple addresses', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            await getService().create(new BlockchainAddress(aliceAddress, user, false))
            const hasAnyAddresses = await getService().hasAnyAddresses(user.id)
            expect(hasAnyAddresses).toBeTruthy()
        })
        it('returns false if there are no addresses', async () => {
            const hasAnyAddresses = await getService().hasAnyAddresses(user.id)
            expect(hasAnyAddresses).toBeFalsy()
        })
    })

    describe('has primary address', () => {
        it('returns true if there is a primary address', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            const hasAnyAddresses = await getService().hasPrimaryAddress(user.id)
            expect(hasAnyAddresses).toBeTruthy()
        })
        it('returns true if there are multiple addresses and one is primary', async () => {
            await getService().create(new BlockchainAddress(bobAddress, user, true))
            await getService().create(new BlockchainAddress(aliceAddress, user, false))
            const hasAnyAddresses = await getService().hasPrimaryAddress(user.id)
            expect(hasAnyAddresses).toBeTruthy()
        })
        it('returns false if there are no addresses', async () => {
            const hasAnyAddresses = await getService().hasPrimaryAddress(user.id)
            expect(hasAnyAddresses).toBeFalsy()
        })
    })
})
