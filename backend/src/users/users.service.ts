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
import { CreateWeb3UserDto } from './dto/create-web3-user.dto'
import { Web3Address } from './web3-addresses/web3-address.entity'
import { Web3AddressesService } from './web3-addresses/web3-addresses.service'
import { isValidAddress } from '../utils/address/address.validator'
import { ClassConstructor } from 'class-transformer/types/interfaces'
import { AssociateEmailAccountDto } from './dto/associate-email-account.dto'
import { CreateWeb3AddressDto } from './web3-addresses/create-web3-address.dto'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly web3AddressService: Web3AddressesService,
    ) {}

    async findOne(id: string): Promise<User> {
        try {
            return await this.findOneOrFail({ id })
        } catch (e: any) {
            throw handleFindError(e, 'There is no user with such id')
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            return await this.findOneOrFail({ username })
        } catch (e: any) {
            throw handleFindError(e, 'There is no user with such username')
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            return await this.findOneOrFail({ email })
        } catch (e: any) {
            throw handleFindError(e, 'There is no user with such email')
        }
    }

    async findOneByAuthId(authId: string): Promise<User> {
        try {
            return await this.findOneOrFail({ authId })
        } catch (e: any) {
            throw handleFindError(e, `There is no user with authId ${authId}`)
        }
    }

    async findOneByWeb3Address(web3Address: string): Promise<User> {
        const users = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.web3Addresses', 'web3Addresses')
            .where('web3Addresses.address = :web3Address', { web3Address })
            .getMany()
        if (!users || users.length === 0) {
            throw new NotFoundException('User not found')
        } else if (users.length > 1) {
            throw new InternalServerErrorException('There are multiple users with the same web3 address')
        } else {
            return this.findOne(users[0].id)
        }
    }

    private async findOneOrFail(conditions: FindConditions<User>): Promise<User> {
        return await this.userRepository.findOneOrFail(conditions, { relations: ['web3Addresses'] })
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
        const userToSave = { ...user, ...dto, isEmailPasswordEnabled: true }
        await this.userRepository.save(userToSave)
        return (await this.findOne(id))!
    }

    async createWeb3User(createWeb3UserDto: CreateWeb3UserDto): Promise<User> {
        await this.validateWeb3User(createWeb3UserDto)
        const user = await this.userRepository.save(
            new User(createWeb3UserDto.authId, createWeb3UserDto.username, createWeb3UserDto.username, false, []),
        )
        await this.web3AddressService.create(new CreateWeb3AddressDto(createWeb3UserDto.web3Address, user))
        return (await this.findOne(user.id))!
    }

    async associateWeb3Address(user: User, address: string): Promise<User> {
        await this.validateWeb3Address(address)
        const currentUserAddresses = await this.web3AddressService.findByUserId(user.id)
        const alreadyHasAddress = currentUserAddresses
            .map((web3Address: Web3Address) => web3Address.address)
            .includes(address)
        if (alreadyHasAddress) {
            throw new BadRequestException('Address already associated')
        }
        await this.web3AddressService.create(new CreateWeb3AddressDto(address, user))
        return (await this.findOne(user.id))!
    }

    async delete(id: string) {
        const currentUser = await this.findOne(id)
        await this.userRepository.remove(currentUser)
    }

    async unlinkAddress(user: User, address: string) {
        const web3Address = await this.checkIfAddressBelongsToTheUser(user, address)
        await this.web3AddressService.deleteAddress(web3Address)
    }

    async makeAddressPrimary(user: User, address: string) {
        await this.checkIfAddressBelongsToTheUser(user, address)
        await this.web3AddressService.makePrimary(user.id, address)
    }

    private async checkIfAddressBelongsToTheUser(user: User, address: string): Promise<Web3Address> {
        const web3Address = user.web3Addresses?.find((bAddress) => bAddress.address === address)
        if (!web3Address) {
            throw new BadRequestException('Address does not belong to the user')
        }
        return web3Address
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

    private async validateUser(createUserDto: CreateUserDto) {
        await this.validateClassAndUsername(CreateUserDto, createUserDto)
        await this.validateEmail(createUserDto.email)
    }

    private async validateWeb3User(createWeb3UserDto: CreateWeb3UserDto): Promise<void> {
        await this.validateClassAndUsername(CreateWeb3UserDto, createWeb3UserDto)
        await this.validateWeb3Address(createWeb3UserDto.web3Address)
    }

    private async validateClassAndUsername<T extends { username: string }>(constructor: ClassConstructor<T>, dto: T) {
        try {
            await validateOrReject(plainToClass(constructor, dto))
        } catch (e: any) {
            throw new BadRequestException(e.message)
        }
        await this.validateUsername(dto.username)
    }

    async validateWeb3Address(address: string): Promise<void> {
        const validAddress = isValidAddress(address)
        if (!validAddress) {
            throw new BadRequestException('Address is invalid')
        }
        const doesAddressExist = await this.web3AddressService.doesAddressExist(address)
        if (doesAddressExist) {
            throw new ConflictException('User with this address already exists')
        }
    }
}
