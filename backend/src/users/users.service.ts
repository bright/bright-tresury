import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "./user.entity";
import {CreateUserDto} from "./dto/createUser.dto";
import {validateOrReject} from "class-validator";
import {plainToClass} from "class-transformer";
import {handleFindError} from "../utils/exceptions/databaseExceptions.handler";
import {CreateBlockchainUserDto} from "./dto/createBlockchainUser.dto";

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
            throw handleFindError(e, 'There is no user with such id')
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            const user = await this.userRepository.findOneOrFail({username})
            return user
        } catch (e) {
            throw handleFindError(e, 'There is no user with such username')
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOneOrFail({email})
            return user
        } catch (e) {
            throw handleFindError(e, 'There is no user with such email')
        }
    }

    async findOneByAuthId(authId: string): Promise<User> {
        try {
            const user = await this.userRepository.findOneOrFail({authId})
            return user
        } catch (e) {
            throw handleFindError(e, 'There is no user with such authId')
        }
    }

    async findOneByBlockchainAddress(blockchainAddress: string): Promise<User | undefined> {
        try {
            const user = await this.userRepository.findOneOrFail({blockchainAddress})
            return user
        } catch (e) {
            throw handleFindError(e, 'There is no user with such blockchain address')
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

    async createBlockchainUser(createBlockchainUserDto: CreateBlockchainUserDto): Promise<User> {
        const valid = await this.validateBlockchainUser(createBlockchainUserDto)
        if (!valid) {
            throw new BadRequestException('Invalid user')
        }
        const user = new User(
            createBlockchainUserDto.authId,
            createBlockchainUserDto.username,
            undefined,
            createBlockchainUserDto.blockchainAddress
        )
        const createdUser = await this.userRepository.save(user)
        return (await this.userRepository.findOne(createdUser.id))!
    }

    async delete(id: string) {
        const currentUser = await this.findOne(id)
        await this.userRepository.remove(currentUser)
    }

    async validateEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({email})
        return !user
    }

    async validateUsername(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({username})
        return !user
    }

    async validateBlockchainAddress(blockchainAddress: string): Promise<boolean> {
        const user = await this.userRepository.findOne({blockchainAddress})
        return !user
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

    private async validateBlockchainUser(createBlockchainUserDto: CreateBlockchainUserDto): Promise<boolean> {
        try {
            await validateOrReject(plainToClass(CreateBlockchainUserDto, createBlockchainUserDto))
            const validUsername = await this.validateUsername(createBlockchainUserDto.username)
            if (!validUsername) {
                return false
            }
            const validAddress = await this.validateBlockchainAddress(createBlockchainUserDto.blockchainAddress)
            if (!validAddress) {
                return false
            }
            return true
        } catch (e) {
            return false
        }
    }
}
