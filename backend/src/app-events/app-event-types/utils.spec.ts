import { beforeAllSetup, beforeSetupFullApp } from '../../utils/spec.helpers'
import { addUserFromWeb3Address, getTaggedUsers } from './utils'
import { UsersService } from '../../users/users.service'
import { NotFoundException } from '@nestjs/common'
import {
    comment,
    commentWithoutTaggedUsers,
    commentWithTwoUsers,
    mockFindOneByWeb3AddressOrThrow,
} from './spec.helpers'

describe('App-event-types', () => {
    describe('getTaggedUsers', () => {
        it('should return tagged user from comment', async () => {
            const taggedUser = await getTaggedUsers(comment)

            expect(taggedUser).toStrictEqual(['900feea4-80d7-4183-ac86-582f3368541c'])
        })

        it('should return more than one tagged user from comment', async () => {
            const taggedUser = await getTaggedUsers(commentWithTwoUsers)

            expect(taggedUser).toStrictEqual([
                '800feea4-80d7-4183-ac86-582f3368541c',
                '900feea4-80d7-4183-ac86-582f3368541c',
            ])
        })

        it('should not return tagged user from comment without tagged user', async () => {
            const taggedUser = await getTaggedUsers(commentWithoutTaggedUsers)

            expect(taggedUser).toHaveLength(0)
            expect(taggedUser).toStrictEqual([])
        })
    })

    describe('addUserFromWeb3Address', () => {
        const app = beforeSetupFullApp()
        const usersService = beforeAllSetup(() => app().get<UsersService>(UsersService))

        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('should not add user from web3 address', async () => {
            const receiverIds: [] = []

            jest.spyOn(usersService(), 'findOneByWeb3AddressOrThrow').mockImplementation(() => {
                throw new NotFoundException('User not found')
            })

            await addUserFromWeb3Address(
                usersService(),
                '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                receiverIds,
            )

            expect(receiverIds).toHaveLength(0)
            expect(receiverIds).toStrictEqual([])
        })

        it('should add user from web3 address', async () => {
            const receiverIds: [] = []

            await mockFindOneByWeb3AddressOrThrow(usersService())

            await addUserFromWeb3Address(
                usersService(),
                '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                receiverIds,
            )

            expect(receiverIds).toHaveLength(1)
            expect(receiverIds).toStrictEqual(['6e36db98-fe0d-46bf-ad42-18ad231ef55d'])
        })

        it('should add more than one user from web3 address', async () => {
            const receiverIds: [] = []

            await mockFindOneByWeb3AddressOrThrow(usersService())

            await addUserFromWeb3Address(
                usersService(),
                '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                receiverIds,
            )
            await addUserFromWeb3Address(
                usersService(),
                '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                receiverIds,
            )

            expect(receiverIds).toHaveLength(2)
            expect(receiverIds).toStrictEqual([
                '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
                '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
            ])
        })
    })
})
