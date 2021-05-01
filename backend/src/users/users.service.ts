import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "./user.entity";
import {CreateUserDto} from "./dto/createUser.dto";
import {validateOrReject} from "class-validator";
import {plainToClass} from "class-transformer";
import {handleFindError} from "../utils/exceptions/databaseExceptions.handler";
import {CreateBlockchainUserDto} from "./dto/createBlockchainUser.dto";
import {BlockchainAddress} from "./blockchainAddress/blockchainAddress.entity";
import {BlockchainAddressService} from "./blockchainAddress/blockchainAddress.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly blockchainAddressService: BlockchainAddressService,
    ) {
    }

    async findOne(id: string): Promise<User> {
        try {
            return await this.userRepository.findOneOrFail(
                id, {
                    relations: ['blockchainAddresses']
                }
            )
        } catch (e) {
            throw handleFindError(e, 'There is no user with such id')
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            return await this.userRepository.findOneOrFail({username})
        } catch (e) {
            throw handleFindError(e, 'There is no user with such username')
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            return await this.userRepository.findOneOrFail({email})
        } catch (e) {
            throw handleFindError(e, 'There is no user with such email')
        }
    }

    async findOneByAuthId(authId: string): Promise<User> {
        try {
            return await this.userRepository.findOneOrFail({authId})
        } catch (e) {
            throw handleFindError(e, 'There is no user with such authId')
        }
    }

    async findOneByBlockchainAddress(blockchainAddress: string): Promise<User> {
        const users = await this.userRepository.find({
            where: {
                blockchainAddresses: {
                    address: blockchainAddress
                }
            },
        })
        if (!users || users.length !== 1) {
            throw new NotFoundException('User not found')
        } else {
            return users[0]
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
        return (await this.findOne(createdUser.id))!
    }

    async createBlockchainUser(createBlockchainUserDto: CreateBlockchainUserDto): Promise<User> {
        const valid = await this.validateBlockchainUser(createBlockchainUserDto)
        if (!valid) {
            throw new BadRequestException('Invalid user')
        }
        const user = await this.userRepository.save(new User(
            createBlockchainUserDto.authId,
            createBlockchainUserDto.username,
            undefined,
            [],
        ))
        await this.blockchainAddressService.create(new BlockchainAddress(
            createBlockchainUserDto.blockchainAddress,
            user,
            true,
        ))
        return (await this.findOne(user.id))!
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

    private async validateUser(createUserDto: CreateUserDto): Promise<boolean> {
        try {
            await validateOrReject(plainToClass(CreateUserDto, createUserDto))
            const validUsername = await this.validateUsername(createUserDto.username)
            if (!validUsername) {
                return false
            }
            return await this.validateEmail(createUserDto.email);

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
            return await this.blockchainAddressService.validateAddress(createBlockchainUserDto.blockchainAddress);
        } catch (e) {
            return false
        }
    }
}
