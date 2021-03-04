import {BadRequestException, NotFoundException} from '@nestjs/common';
import {getRepositoryToken} from "@nestjs/typeorm";
import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase} from '../utils/spec.helpers';
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {CreateUserDto} from "./dto/createUser.dto";

describe(`Users Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(UsersService)
    const getRepository = () => app.get().get(getRepositoryToken(User))

    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('create', () => {
        it('should create user', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com'
            })
            expect(user).toBeDefined()
        })
        it('should save user', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com'
            })
            const savedUser = await getRepository().findOne(user.id)
            expect(savedUser).toBeDefined()
        })
        it('should throw bad request exception when email exists', async () => {
            const user: CreateUserDto = {
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com'
            }
            await getService().create(user)

            await expect(getService().create({
                authId: uuid(),
                username: 'Bart',
                email: user.email,
            })).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when username exists', async () => {
            const user: CreateUserDto = {
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com'
            }
            await getService().create(user)

            await expect(getService().create({
                authId: uuid(),
                username: user.username,
                email: 'bart@email.com',
            })).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when auth id is empty', async () => {
            await expect(getService().create({
                authId: '',
                username: 'Bart',
                email: 'bart@email.com',
            })).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when username is empty', async () => {
            await expect(getService().create({
                authId: uuid(),
                username: '',
                email: 'bart@email.com',
            })).rejects.toThrow(BadRequestException)
        })
        it('should throw bad request exception when email is empty', async () => {
            await expect(getService().create({
                authId: uuid(),
                username: 'Bart',
                email: '',
            })).rejects.toThrow(BadRequestException)
        })
    })

    describe('find one', () => {
        it('should return user by id', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com'
            })

            const savedUser = await getService().findOne(user.id)

            expect(savedUser!.id).toBe(user.id)
        })
        it('should throw not found exception if wrong id', async () => {
            await expect(getService().findOne(uuid()))
                .rejects
                .toThrow(NotFoundException)
        })
        it('should return user by username', async () => {
            const username = 'Chuck'
            await getService().create({
                authId: uuid(),
                username,
                email: 'chuck@email.com'
            })

            const user = await getService().findOneByUsername(username)

            expect(user!.username).toBe(username)
        })
        it('should throw not found exception if wrong username', async () => {
            await expect(getService().findOneByUsername('Noname'))
                .rejects
                .toThrow(NotFoundException)
        })
        it('should return user by email', async () => {
            const email = 'chuck@email.com'
            await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email
            })

            const user = await getService().findOneByEmail(email)

            expect(user!.email).toBe(email)
        })
        it('should throw not found exception if wrong email', async () => {
            await expect(getService().findOneByEmail('not@existing.email'))
                .rejects
                .toThrow(NotFoundException)
        })
        it('should return user by authId', async () => {
            const authId = uuid()
            await getService().create({
                authId,
                username: 'Chuck',
                email: 'chuck@email.com'
            })

            const user = await getService().findOneByAuthId(authId)

            expect(user!.authId).toBe(authId)
        })
        it('should throw not found exception if wrong email', async () => {
            await expect(getService().findOneByAuthId(uuid()))
                .rejects
                .toThrow(NotFoundException)
        })
    })

    describe('delete', () => {
        it('deletes user', async () => {
            const user = await getService().create({
                authId: uuid(),
                username: 'Chuck',
                email: 'chuck@email.com'
            })
            await getService().delete(user.id)
            await expect(getService().findOne(user.id))
                .rejects
                .toThrow(NotFoundException)
        })
        it('deleting not existing user throws not found exception', async () => {
            await expect(getService().delete(uuid()))
                .rejects
                .toThrow(NotFoundException)
        })
    })
})
