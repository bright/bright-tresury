import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { CreateWeb3UserDto } from './dto/create-web3-user.dto'
import { Web3AddressEntity } from './web3-addresses/web3-address.entity'
import { UserStatus } from './entities/user-status'

describe(`Users Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(UserEntity))
    const getWeb3AddressRepository = () => app.get().get(getRepositoryToken(Web3AddressEntity))

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const charlieAddress = '14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q'

    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('create user', () => {
        it('should return user', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            })
            expect(user).toBeDefined()
            expect(user.email).toBe('chuck@email.com')
            expect(user.username).toBe('Chuck')
            expect(user.status).toBe('emailPasswordEnabled')
            expect(user.isEmailNotificationEnabled).toBe(true)
        })
        it('should save user', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            })
            const savedUser = await getRepository().findOne(user.id)
            expect(savedUser).toBeDefined()
        })
        it('should throw bad request exception when email exists', async () => {
            const user: CreateUserDto = {
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            }
            await getService().create(user)

            await expect(
                getService().create({
                    authId: uuid(),
                    username: 'Bart',
                    email: user.email,
                }),
            ).rejects.toThrow(ConflictException)
        })
        it('should throw bad request exception when username exists', async () => {
            const user: CreateUserDto = {
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            }
            await getService().create(user)

            await expect(
                getService().create({
                    authId: uuid(),
                    username: user.username,
                    email: 'bart@email.com',
                }),
            ).rejects.toThrow(ConflictException)
        })
        it('should throw bad request exception when auth id is empty', async () => {
            await expect(
                getService().create({
                    authId: '',
                    username: 'Bart',
                    email: 'bart@email.com',
                }),
            ).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when username is empty', async () => {
            await expect(
                getService().create({
                    authId: uuid(),
                    username: '',
                    email: 'bart@email.com',
                }),
            ).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when email is empty', async () => {
            await expect(
                getService().create({
                    authId: uuid(),
                    username: 'Bart',
                    email: '',
                }),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('associateEmailAccount', () => {
        let user: UserEntity
        beforeEach(async () => {
            user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            })
        })

        it('should return user', async () => {
            const updatedUser = await getService().associateEmailAccount(user.id, {
                username: 'Bob',
                email: 'bob@email.com',
            })
            expect(updatedUser).toBeDefined()
            expect(updatedUser.username).toBe('Bob')
            expect(updatedUser.email).toBe('bob@email.com')
            expect(updatedUser.status).toBe('emailPasswordEnabled')
            expect(updatedUser.authId).toBe(user.authId)
        })

        it('should save email and username', async () => {
            await getService().associateEmailAccount(user.id, {
                username: 'Bob',
                email: 'bob@email.com',
            })

            const updatedUser = await getRepository().findOne(user.id)

            expect(updatedUser).toBeDefined()
            expect(updatedUser.username).toBe('Bob')
            expect(updatedUser.email).toBe('bob@email.com')
            expect(updatedUser.authId).toBe(user.authId)
        })

        it(`should set status to ${UserStatus.EmailPasswordEnabled}`, async () => {
            await getService().associateEmailAccount(user.id, {
                username: 'Bob',
                email: 'bob@email.com',
            })

            const updatedUser = await getRepository().findOne(user.id)

            expect(updatedUser.status).toBe(UserStatus.EmailPasswordEnabled)
        })

        it('should throw not found for not existing user', async () => {
            await expect(
                getService().associateEmailAccount(uuid(), {
                    username: 'Bob',
                    email: 'bob@email.com',
                }),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw conflict exception for already existing email', async () => {
            const aliceUser = await getService().create({ authId: uuid(), username: 'Alice', email: 'alice@email.com' })
            await expect(
                getService().associateEmailAccount(user.id, {
                    email: aliceUser.email,
                    username: 'Bob',
                }),
            ).rejects.toThrow(ConflictException)
        })

        it('should throw conflict exception for already existing username', async () => {
            const aliceUser = await getService().create({ authId: uuid(), username: 'Alice', email: 'alice@email.com' })
            await expect(
                getService().associateEmailAccount(user.id, {
                    username: aliceUser.username,
                    email: 'bob@examplecom',
                }),
            ).rejects.toThrow(ConflictException)
        })
    })

    describe('create web3 user', () => {
        it('should create user', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            })
            expect(user).toBeDefined()
        })
        it('should save user', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            })
            const savedUser = await getRepository().findOne(user.id)
            expect(savedUser).toBeDefined()
            expect(savedUser.status).toBe(UserStatus.Web3Only)
        })
        it('should set status to web3Only', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            })
            const savedUser = await getRepository().findOne(user.id)
            expect(savedUser).toBeDefined()
            expect(savedUser.status).toBe(UserStatus.Web3Only)
        })
        it('should save user and address', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            })
            const savedUser = await getRepository().findOne(user.id)
            expect(savedUser).toBeDefined()
            const savedAddress = await getWeb3AddressRepository().findOne(user.web3Addresses![0].id)
            expect(savedAddress.address).toBe(bobAddress)
            expect(savedAddress.isPrimary).toBeTruthy()
        })
        it('should throw conflict exception when address exists', async () => {
            const user: CreateWeb3UserDto = {
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            }
            await getService().createWeb3User(user)

            await expect(
                getService().createWeb3User({
                    authId: uuid(),
                    username: 'Bart',
                    web3Address: user.web3Address,
                }),
            ).rejects.toThrow(ConflictException)
        })
        it('should throw bad request exception when username exists', async () => {
            const user: CreateWeb3UserDto = {
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            }
            await getService().createWeb3User(user)

            await expect(
                getService().createWeb3User({
                    authId: uuid(),
                    username: user.username,
                    web3Address: bobAddress,
                }),
            ).rejects.toThrow(ConflictException)
        })
        it('should throw bad request exception when auth id is empty', async () => {
            await expect(
                getService().createWeb3User({
                    authId: '',
                    username: 'Bob',
                    web3Address: bobAddress,
                }),
            ).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when username is empty', async () => {
            await expect(
                getService().createWeb3User({
                    authId: uuid(),
                    username: '',
                    web3Address: bobAddress,
                }),
            ).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when address is empty', async () => {
            await expect(
                getService().createWeb3User({
                    authId: uuid(),
                    username: 'Bob',
                    web3Address: '',
                }),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('find one by id', () => {
        it('should return user by id', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            })

            const savedUser = await getService().findOneOrThrow(user.id)

            expect(savedUser!.id).toBe(user.id)
        })
        it('should throw not found exception if wrong id', async () => {
            await expect(getService().findOneOrThrow(uuid())).rejects.toThrow(NotFoundException)
        })
    })

    describe('find one by username', () => {
        it('should return user by username', async () => {
            const username = 'Chuck'
            await getService().create({
                authId: uuid(),
                username,
                email: 'chuck@email.com',
            })

            const user = await getService().findOneByUsername(username)

            expect(user!.username).toBe(username)
        })
        it('should throw not found exception if wrong username', async () => {
            await expect(getService().findOneByUsername('Noname')).rejects.toThrow(NotFoundException)
        })
    })

    describe('find one by email', () => {
        it('should return user by email', async () => {
            const email = 'chuck@email.com'
            await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email,
            })

            const user = await getService().findOneByEmail(email)

            expect(user!.email).toBe(email)
        })
        it('should throw not found exception if wrong email', async () => {
            await expect(getService().findOneByEmail('not@existing.email')).rejects.toThrow(NotFoundException)
        })
    })

    describe('find one by authId', () => {
        it('should return user by authId', async () => {
            const authId = uuid()
            await getService().create({
                authId,
                username: 'Chuck',
                email: 'chuck@email.com',
            })

            const user = await getService().findOneByAuthId(authId)

            expect(user!.authId).toBe(authId)
        })
        it('should throw not found exception if wrong email', async () => {
            await expect(getService().findOneByAuthId(uuid())).rejects.toThrow(NotFoundException)
        })
    })

    describe('find one by web3 address', () => {
        it('should return user by web3 address', async () => {
            const web3Address = bobAddress
            await getService().createWeb3User({
                authId: uuid(),
                username: 'Chuck',
                web3Address,
            })

            const user = await getService().findOneByWeb3AddressOrThrow(web3Address)

            expect(user).toBeDefined()
        })
        it('should return user by web3 address if there are multiple users', async () => {
            const web3Address = bobAddress
            await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address,
            })
            await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            })

            const user = await getService().findOneByWeb3AddressOrThrow(web3Address)

            expect(user).toBeDefined()
        })
        it('should throw not found exception if wrong web3 address', async () => {
            await expect(getService().findOneByWeb3AddressOrThrow(uuid())).rejects.toThrow(NotFoundException)
        })
    })

    describe('find by display name', () => {
        it('should return user by username', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'chuck',
                email: 'chuck@email.com',
            })

            const actual = await getService().findByDisplay('chuck')
            expect(actual).toHaveLength(1)
            expect(actual[0].userId).toBe(user.id)
        })

        it('should return user by web3 address', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            })

            const actual = await getService().findByDisplay(charlieAddress)
            expect(actual).toHaveLength(1)
            expect(actual[0].userId).toBe(user.id)
        })
        it('should return public user data with non primary address when asked with non primary address', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            })
            await getService().associateWeb3Address(user, bobAddress)
            const actual = await getService().findByDisplay(charlieAddress)
            expect(actual).toHaveLength(1)
            expect(actual[0].userId).toBe(user.id)
            expect(actual[0].web3address).toBe(charlieAddress)
        })
        it('should return empty array when asked for address that does not exist in the database', async () => {
            const actual = await getService().findByDisplay(bobAddress)
            expect(actual).toHaveLength(0)
        })
    })
    describe('get public user data for web3 address', () => {
        it('should return public user data for existing user', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            })
            const actual = await getService().getPublicUserDataForWeb3Address(charlieAddress)
            expect(actual).toMatchObject({
                userId: user.id,
                username: 'Charlie',
                status: UserStatus.Web3Only,
                web3address: charlieAddress,
            })
        })
        it('should return public user data with just web3 address for non existing user', async () => {
            const actual = await getService().getPublicUserDataForWeb3Address(charlieAddress)
            expect(actual).toMatchObject({
                web3address: charlieAddress,
            })
        })
    })
    describe('delete', () => {
        it('forgets the user data', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com',
            })
            await getService().delete(user.id)

            const deletedUser = await getService().findOneOrThrow(user.id)

            expect(deletedUser.username).not.toBe(user.username)
            expect(deletedUser.email).not.toBe(user.email)
        })
        it('forgets web3 addresses', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Chuck',
                web3Address: bobAddress,
            })
            await getService().delete(user.id)

            const addresses = await getWeb3AddressRepository().find({
                user: {
                    id: user.id,
                },
            })

            expect(addresses.length).toBe(1)
            expect(addresses[0]).not.toBe(user.web3Addresses)
        })
        it('forgets the not existing user throws not found exception', async () => {
            await expect(getService().delete(uuid())).rejects.toThrow(NotFoundException)
        })
        it('forgets two users', async () => {
            const user = await getService().create({
                authId: '123e4567-e89b-12d3-a456-426614174000',
                username: 'Chuck',
                email: 'chuck@email.com',
            })

            const anotherUser = await getService().create({
                authId: uuid(),
                username: 'Bob',
                email: 'bob@email.com',
            })

            await getService().delete(user.id)
            const deletedUser = await getService().findOneOrThrow(user.id)

            await getService().delete(user.id)
            const deletedAnotherUser = await getService().findOneOrThrow(anotherUser.id)

            expect(deletedUser.username).not.toBe(user.username)
            expect(deletedUser.email).not.toBe(user.email)

            expect(deletedAnotherUser.username).not.toBe(user.username)
            expect(deletedAnotherUser.email).not.toBe(user.email)
        })
    })

    describe('associate address', () => {
        it('associates first address for email user ', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Charlie',
                email: 'charlie@email.com',
            } as CreateUserDto)

            const userAfterAssociation = await getService().associateWeb3Address(user, charlieAddress)
            expect(userAfterAssociation.web3Addresses![0].address).toBe(charlieAddress)
            expect(userAfterAssociation.web3Addresses![0].isPrimary).toBe(true)
        })
        it('associates second address for web3 user ', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            })

            const userAfterAssociation = await getService().associateWeb3Address(user, bobAddress)
            const addresses = userAfterAssociation.web3Addresses!.map((web3Address) => web3Address.address)
            expect(addresses).toContain(charlieAddress)
            expect(addresses).toContain(bobAddress)

            const primaryAddress = userAfterAssociation.web3Addresses!.find(
                (bAddress) => bAddress.address === charlieAddress,
            )
            const associatedAddress = userAfterAssociation.web3Addresses!.find(
                (bAddress) => bAddress.address === bobAddress,
            )
            expect(primaryAddress!.isPrimary).toBeTruthy()
            expect(associatedAddress!.isPrimary).toBeFalsy()
        })
        it('throws conflict exception if address already associated with another user', async () => {
            await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            })
            const charlieUser = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            })

            await expect(getService().associateWeb3Address(charlieUser, bobAddress)).rejects.toThrow(ConflictException)
        })
        it('throws bad request if address is invalid', async () => {
            const bobUser = await getService().create({
                authId: uuid(),
                username: 'Bob',
                email: 'bob@email.com',
            })

            await expect(getService().associateWeb3Address(bobUser, uuid())).rejects.toThrow(BadRequestException)
        })
    })

    describe('unlink address', () => {
        it('removes secondary address', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            } as CreateWeb3UserDto)

            const userAfterAssociating = await getService().associateWeb3Address(user, bobAddress)
            expect(userAfterAssociating.web3Addresses!.length).toBe(2)

            await getService().unlinkAddress(userAfterAssociating.id, bobAddress)
            const userAfterUnlinking = await getService().findOneOrThrow(user.id)
            expect(userAfterUnlinking.web3Addresses!.length).toBe(1)
            expect(userAfterUnlinking.web3Addresses![0].address).toBe(charlieAddress)
        })
        it('does not allow to remove primary address', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            } as CreateWeb3UserDto)

            await expect(getService().unlinkAddress(user.id, charlieAddress)).rejects.toThrow(BadRequestException)
        })
        it('does not allow to remove address belonging to another user', async () => {
            const charlieUser = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            } as CreateWeb3UserDto)
            await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            } as CreateWeb3UserDto)

            await expect(getService().unlinkAddress(charlieUser.id, bobAddress)).rejects.toThrow(BadRequestException)
        })
    })

    describe('make address primary', () => {
        it('successfully makes address and set other addresses as non-primary', async () => {
            const user = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            } as CreateWeb3UserDto)

            const userWithTwoAddresses = await getService().associateWeb3Address(user, bobAddress)

            await getService().makeAddressPrimary(userWithTwoAddresses.id, bobAddress)
            const userWithChangedPrimaryAddress = await getService().findOneOrThrow(user.id)

            const bobWeb3Address = userWithChangedPrimaryAddress.web3Addresses!.find(
                (bAddress) => bAddress.address === bobAddress,
            )
            expect(bobWeb3Address!.isPrimary).toBeTruthy()
            const charlieWeb3Address = userWithChangedPrimaryAddress.web3Addresses!.find(
                (bAddress) => bAddress.address === charlieAddress,
            )
            expect(charlieWeb3Address!.isPrimary).toBeFalsy()
        })
        it('does not allow to make primary address belonging to another user', async () => {
            const charlieUser = await getService().createWeb3User({
                authId: uuid(),
                username: 'Charlie',
                web3Address: charlieAddress,
            } as CreateWeb3UserDto)
            await getService().createWeb3User({
                authId: uuid(),
                username: 'Bob',
                web3Address: bobAddress,
            } as CreateWeb3UserDto)

            await expect(getService().makeAddressPrimary(charlieUser.id, bobAddress)).rejects.toThrow(
                BadRequestException,
            )
        })
    })
})
