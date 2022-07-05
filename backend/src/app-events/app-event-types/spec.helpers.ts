import { UsersService } from '../../users/users.service'
import { UserEntity } from '../../users/entities/user.entity'
import { UserStatus } from '../../users/entities/user-status'
import { CommentEntity } from '../../discussions/entites/comment.entity'

export async function mockFindOneByWeb3AddressOrThrow(usersService: UsersService) {
    jest.spyOn(usersService, 'findOneByWeb3AddressOrThrow').mockImplementation(
        (): Promise<UserEntity> => {
            return Promise.resolve({
                id: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
                createdAt: new Date(2022, 6, 14),
                updatedAt: new Date(2022, 6, 14),
                authId: '68a4f999-80c8-4199-9ab2-2c30c36b8643',
                username: '353eb0cb-2c74-416b-95de-dd532ab1d165',
                email: 'example@gg.com',
                status: UserStatus.EmailPasswordEnabled,
                isEmailNotificationEnabled: true,
                web3Addresses: undefined,
                generateUuid: () => {},
            })
        },
    )
}

export const comment = ({
    id: '900feea4-80d7-4183-ac86-582f3368541c',
    createdAt: new Date(2022, 6, 20),
    updatedAt: new Date(2022, 6, 20),
    authorId: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
    content: 'comment [@user2](900feea4-80d7-4183-ac86-582f3368541c) ',
    discussionId: 'd703ad7d-1682-4e23-9844-6b5c88761ef4',
    author: {
        id: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
        createdAt: new Date(2022, 6, 14),
        updatedAt: new Date(2022, 6, 14),
        authId: '68a4f999-80c8-4199-9ab2-2c30c36b8643',
        username: '353eb0cb-2c74-416b-95de-dd532ab1d165',
        email: 'example@gg.com',
        status: UserStatus.EmailPasswordEnabled,
        isEmailNotificationEnabled: true,
        web3Addresses: [
            {
                address: '',
                user: {
                    authId: '',
                    username: 'username',
                    email: '',
                    web3Addresses: undefined,
                    status: UserStatus.EmailPasswordEnabled,
                    isEmailNotificationEnabled: false,
                    createdAt: new Date(2022, 6, 14),
                    updatedAt: new Date(2022, 6, 14),
                },
                isPrimary: false,
            },
        ],
    },
    time: new Date(2022, 6, 28),
    reactions: [],
    isAuthor: () => {},
    isAuthorOrThrow: () => {},
    generateUuid: () => {},
} as unknown) as CommentEntity

export const commentWithTwoUsers = ({
    id: '900feea4-80d7-4183-ac86-582f3368541c',
    createdAt: new Date(2022, 6, 20),
    updatedAt: new Date(2022, 6, 20),
    authorId: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
    content:
        'comment [@user1](800feea4-80d7-4183-ac86-582f3368541c) and [@user2](900feea4-80d7-4183-ac86-582f3368541c) ',
    discussionId: 'd703ad7d-1682-4e23-9844-6b5c88761ef4',
    author: {
        id: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
        createdAt: new Date(2022, 6, 14),
        updatedAt: new Date(2022, 6, 14),
        authId: '68a4f999-80c8-4199-9ab2-2c30c36b8643',
        username: '353eb0cb-2c74-416b-95de-dd532ab1d165',
        email: 'example@gg.com',
        status: UserStatus.EmailPasswordEnabled,
        isEmailNotificationEnabled: true,
        web3Addresses: [
            {
                address: '',
                user: {
                    authId: '',
                    username: 'username',
                    email: '',
                    web3Addresses: undefined,
                    status: UserStatus.EmailPasswordEnabled,
                    isEmailNotificationEnabled: false,
                    createdAt: new Date(2022, 6, 14),
                    updatedAt: new Date(2022, 6, 14),
                },
                isPrimary: false,
            },
        ],
    },
    time: new Date(2022, 6, 28),
    reactions: [],
    isAuthor: () => {},
    isAuthorOrThrow: () => {},
    generateUuid: () => {},
} as unknown) as CommentEntity

export const commentWithoutTaggedUsers = ({
    id: '900feea4-80d7-4183-ac86-582f3368541c',
    createdAt: new Date(2022, 6, 20),
    updatedAt: new Date(2022, 6, 20),
    authorId: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
    content: 'comment without tagged users ',
    discussionId: 'd703ad7d-1682-4e23-9844-6b5c88761ef4',
    author: {
        id: '6e36db98-fe0d-46bf-ad42-18ad231ef55d',
        createdAt: new Date(2022, 6, 14),
        updatedAt: new Date(2022, 6, 14),
        authId: '68a4f999-80c8-4199-9ab2-2c30c36b8643',
        username: '353eb0cb-2c74-416b-95de-dd532ab1d165',
        email: 'example@gg.com',
        status: UserStatus.EmailPasswordEnabled,
        isEmailNotificationEnabled: true,
        web3Addresses: [
            {
                address: '',
                user: {
                    authId: '',
                    username: 'username',
                    email: '',
                    web3Addresses: undefined,
                    status: UserStatus.EmailPasswordEnabled,
                    isEmailNotificationEnabled: false,
                    createdAt: new Date(2022, 6, 14),
                    updatedAt: new Date(2022, 6, 14),
                },
                isPrimary: false,
            },
        ],
    },
    time: new Date(2022, 6, 28),
    reactions: [],
    isAuthor: () => {},
    isAuthorOrThrow: () => {},
    generateUuid: () => {},
} as unknown) as CommentEntity
