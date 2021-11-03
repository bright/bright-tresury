import { getRepositoryToken } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { Web3AddressesService } from './web3-addresses.service'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { Web3AddressEntity } from './web3-address.entity'
import { UserEntity } from '../user.entity'
import { UsersService } from '../users.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { BadRequestException } from '@nestjs/common'
import { CreateWeb3AddressDto } from './create-web3-address.dto'

describe(`Web3 Addresses Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(Web3AddressesService)
    const getUserService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(Web3AddressEntity))

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'

    let user: UserEntity

    beforeEach(async () => {
        await cleanDatabase()
        user = await getUserService().create({
            authId: uuid(),
            username: 'Bob',
            email: 'bob@email.com',
        } as CreateUserDto)
    })

    describe('create', () => {
        it('should return web3 address', async () => {
            const web3Address = await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            expect(web3Address).toBeDefined()
            expect(web3Address.address).toBe(bobAddress)
        })
        it('should save web3 address', async () => {
            const web3Address = await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            const savedWeb3Address = await getRepository().findOne(web3Address.id)
            expect(savedWeb3Address).toBeDefined()
            expect(savedWeb3Address.address).toBe(bobAddress)
        })
    })

    describe('doesAddressExist', () => {
        it('should return false if address does not exists', async () => {
            const doesAddressExist = await getService().doesAddressExist(bobAddress)
            expect(doesAddressExist).toBe(false)
        })
        it('should return true if address exists', async () => {
            await getService().create(new CreateWeb3AddressDto(bobAddress, user))

            const doesAddressExist = await getService().doesAddressExist(bobAddress)
            expect(doesAddressExist).toBe(true)
        })
    })

    describe('find by user id', () => {
        it('should return addresses belonging to the user', async () => {
            const address1 = await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            const address2 = await getService().create(new CreateWeb3AddressDto(aliceAddress, user))

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
            const addressBobUser = await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            const aliceUser = await getUserService().create({
                authId: uuid(),
                username: 'Alice',
                email: 'alice@email.com',
            } as CreateUserDto)
            const addressAliceUser = await getService().create(new CreateWeb3AddressDto(aliceAddress, aliceUser))

            const addresses = await getService().findByUserId(user.id)
            expect(addresses.length).toBe(1)

            const addressIds = addresses.map((address) => address.id)
            expect(addressIds).toContain(addressBobUser.id)
            expect(addressIds).not.toContain(addressAliceUser.id)
        })
    })

    describe('delete', () => {
        it('throw bad request exception if address is primary', async () => {
            const primaryAddress = await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            await getService().create(new CreateWeb3AddressDto(aliceAddress, user))
            await expect(getService().deleteAddress(primaryAddress)).rejects.toThrow(BadRequestException)
        })
        it('removes secondary address', async () => {
            await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            const secondaryAddress = await getService().create(new CreateWeb3AddressDto(aliceAddress, user))
            await getService().deleteAddress(secondaryAddress)

            const addresses = await getService().findByUserId(user.id)
            expect(addresses.length).toBe(1)

            const address = await getRepository().findOne(secondaryAddress)
            expect(address).toBeUndefined()
        })
    })

    describe('has any address', () => {
        it('returns true if there is an address', async () => {
            await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            const hasAnyAddresses = await getService().hasAnyAddresses(user.id)
            expect(hasAnyAddresses).toBeTruthy()
        })
        it('returns true if there are multiple addresses', async () => {
            await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            await getService().create(new CreateWeb3AddressDto(aliceAddress, user))
            const hasAnyAddresses = await getService().hasAnyAddresses(user.id)
            expect(hasAnyAddresses).toBeTruthy()
        })
        it('returns false if there are no addresses', async () => {
            const hasAnyAddresses = await getService().hasAnyAddresses(user.id)
            expect(hasAnyAddresses).toBeFalsy()
        })
    })

    describe('make primary', () => {
        beforeEach(async () => {
            await getService().create(new CreateWeb3AddressDto(bobAddress, user))
            await getService().create(new CreateWeb3AddressDto(aliceAddress, user))
        })

        it('makes address primary', async () => {
            await getService().makePrimary(user.id, aliceAddress)

            const web3Addresses = await getService().findByUserId(user.id)
            const aliceWeb3Address = web3Addresses.find((web3Address) => web3Address.address === aliceAddress)
            expect(aliceWeb3Address!.isPrimary).toBeTruthy()
        })
        it('make other addresses non primary', async () => {
            await getService().makePrimary(user.id, bobAddress)

            const web3Addresses = await getService().findByUserId(user.id)
            const aliceWeb3Address = web3Addresses.find((bAddress) => bAddress.address === aliceAddress)
            expect(aliceWeb3Address!.isPrimary).toBeFalsy()
        })
    })
})
