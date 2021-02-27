import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "./user.entity";
import {CreateUserDto} from "./dto/createUser.dto";
import {validateOrReject} from "class-validator";
import {plainToClass} from "class-transformer";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOneOrFail(id)
            return user
        } catch (e) {
            throw new NotFoundException('There is no user with such id')
        }
    }

    async findOneByUsername(username: string): Promise<User | undefined> {
        try {
            const user = await this.userRepository.findOneOrFail({username})
            return user
        } catch (e) {
            throw new NotFoundException('There is no user with such username')
        }
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.userRepository.findOneOrFail({email})
            return user
        } catch (e) {
            throw new NotFoundException('There is no user with such email')
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const valid = await this.validateUser(createUserDto)
        if (!valid) {
            throw new BadRequestException('Invalid user')
        }
        const user = new User(
            createUserDto.authId,
            createUserDto.username,
            createUserDto.email
        )
        const createdUser = await this.userRepository.save(user)
        return (await this.userRepository.findOne(createdUser.id))!
    }

    async delete(id: string) {
        const currentUser = await this.findOne(id)
        await this.userRepository.remove(currentUser)
    }

    async validateEmail(email: string): Promise<boolean> {
        try {
            const existingUser = await this.findOneByEmail(email)
            return !existingUser
        } catch (e) {
            return true
        }
    }

    async validateUsername(username: string): Promise<boolean> {
        try {
            const existingUser = await this.findOneByUsername(username)
            return !existingUser
        } catch (e) {
            return true
        }
    }

    private async validateUser(createUserDto: CreateUserDto): Promise<boolean> {
        try {

            await validateOrReject(plainToClass(CreateUserDto, createUserDto))
            const validUsername = await this.validateUsername(createUserDto.username)
            if (!validUsername) {
                return false
            }
            const validEmail = await this.validateEmail(createUserDto.email)
            if (!validEmail) {
                return false
            }
            return true
        } catch (e) {
            return false
        }
    }
}
