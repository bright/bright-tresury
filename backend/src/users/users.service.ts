import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { handleFindError } from '../utils/exceptions/databaseExceptions.handler'
import { CreateBlockchainUserDto } from './dto/create-blockchain-user.dto'
import { BlockchainAddress } from './blockchainAddress/blockchainAddress.entity'
import { BlockchainAddressService } from './blockchainAddress/blockchainAddress.service'
import { isValidAddress } from '../utils/address/address.validator'
import { ClassConstructor } from 'class-transformer/types/interfaces'
import { AssociateEmailAccountDto } from './dto/associate-email-account.dto'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly blockchainAddressService: BlockchainAddressService,
    ) {}

    async findOne(id: string): Promise<User> {
        try {
            return await this.findOneOrFail({ id })
        } catch (e) {
            throw handleFindError(e, 'There is no user with such id')
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            return await this.findOneOrFail({ username })
        } catch (e) {
            throw handleFindError(e, 'There is no user with such username')
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            return await this.findOneOrFail({ email })
        } catch (e) {
            throw handleFindError(e, 'There is no user with such email')
        }
    }

    async findOneByAuthId(authId: string): Promise<User> {
        try {
            return await this.findOneOrFail({ authId })
        } catch (e) {
            throw handleFindError(e, `There is no user with authId ${authId}`)
        }
    }

    async findOneByBlockchainAddress(blockchainAddress: string): Promise<User> {
        const users = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.blockchainAddresses', 'blockchainAddresses')
            .where('blockchainAddresses.address = :blockchainAddress', { blockchainAddress })
            .getMany()
        if (!users || users.length === 0) {
            throw new NotFoundException('User not found')
        } else if (users.length > 1) {
            throw new InternalServerErrorException('There are multiple users with the same blockchain address')
        } else {
            return this.findOne(users[0].id)
        }
    }

    private async findOneOrFail(conditions: FindConditions<User>): Promise<User> {
        return await this.userRepository.findOneOrFail(conditions, { relations: ['blockchainAddresses'] })
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        await this.validateUser(createUserDto)
        const user = new User(createUserDto.authId, createUserDto.username, createUserDto.email, true)
        const createdUser = await this.userRepository.save(user)
        return (await this.findOne(createdUser.id))!
    }

    async associateEmailAccount(id: string, dto: AssociateEmailAccountDto): Promise<User> {
        if (dto.email) {
            await this.validateEmail(dto.email)
        }
        if (dto.username) {
            await this.validateUsername(dto.username)
        }
        const user = await this.findOne(id)
        const userToSave = {...user, ...dto, isEmailPasswordEnabled: true}
        await this.userRepository.save(userToSave)
        return (await this.findOne(id))!
    }

    async createBlockchainUser(createBlockchainUserDto: CreateBlockchainUserDto): Promise<User> {
        await this.validateBlockchainUser(createBlockchainUserDto)
        const user = await this.userRepository.save(
            new User(
                createBlockchainUserDto.authId,
                createBlockchainUserDto.username,
                createBlockchainUserDto.username,
                false,
                [],
            ),
        )
        await this.blockchainAddressService.create(
            new BlockchainAddress(createBlockchainUserDto.blockchainAddress, user, true),
        )
        return (await this.findOne(user.id))!
    }

    async associateBlockchainAddress(user: User, address: string): Promise<User> {
        await this.validateAssociateAddress(address)
        const currentUserAddresses = await this.blockchainAddressService.findByUserId(user.id)
        const alreadyHasAddress = currentUserAddresses
            .map((blockchainAddress: BlockchainAddress) => blockchainAddress.address)
            .includes(address)
        if (alreadyHasAddress) {
            throw new BadRequestException('Address already associated')
        }
        const isPrimary = !(await this.blockchainAddressService.hasAnyAddresses(user.id))
        await this.blockchainAddressService.create(new BlockchainAddress(address, user, isPrimary))
        return (await this.findOne(user.id))!
    }

    async delete(id: string) {
        const currentUser = await this.findOne(id)
        await this.userRepository.remove(currentUser)
    }

    async unlinkAddress(user: User, address: string) {
        const blockchainAddress = await this.checkIfAddressBelongsToTheUser(user, address)
        await this.blockchainAddressService.deleteAddress(blockchainAddress)
    }

    async makeAddressPrimary(user: User, address: string) {
        await this.checkIfAddressBelongsToTheUser(user, address)
        await this.blockchainAddressService.makePrimary(user.id, address)
    }

    private async checkIfAddressBelongsToTheUser(user: User, address: string): Promise<BlockchainAddress> {
        const blockchainAddress = user.blockchainAddresses?.find((bAddress) => bAddress.address === address)
        if (!blockchainAddress) {
            throw new BadRequestException('Address does not belong to the user')
        }
        return blockchainAddress
    }

    async validateEmail(email: string) {
        const user = await this.userRepository.findOne({ email })
        if (user) {
            throw new ConflictException('User with this email already exists')
        }
    }

    async validateUsername(username: string) {
        const user = await this.userRepository.findOne({ username })
        if (user) {
            throw new ConflictException('User with this username already exists')
        }
    }

    async validateAssociateAddress(address: string) {
        await this.validateBlockchainAddress(address)
    }

    private async validateUser(createUserDto: CreateUserDto) {
        await this.validateClassAndUsername(CreateUserDto, createUserDto)
        await this.validateEmail(createUserDto.email)
    }

    private async validateBlockchainUser(createBlockchainUserDto: CreateBlockchainUserDto): Promise<void> {
        await this.validateClassAndUsername(CreateBlockchainUserDto, createBlockchainUserDto)
        await this.validateBlockchainAddress(createBlockchainUserDto.blockchainAddress)
    }

    private async validateClassAndUsername<T extends { username: string }>(constructor: ClassConstructor<T>, dto: T) {
        try {
            await validateOrReject(plainToClass(constructor, dto))
        } catch (e) {
            throw new BadRequestException(e.message)
        }
        await this.validateUsername(dto.username)
    }

    private async validateBlockchainAddress(address: string): Promise<void> {
        const validAddress = isValidAddress(address)
        if (!validAddress) {
            throw new BadRequestException('Address is invalid')
        }
        const doesAddressExist = await this.blockchainAddressService.doesAddressExist(address)
        if (doesAddressExist) {
            throw new ConflictException('User with this address already exists')
        }
    }
}
