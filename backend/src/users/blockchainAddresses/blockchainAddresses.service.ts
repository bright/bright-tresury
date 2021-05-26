import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainAddress } from './blockchainAddress.entity'

@Injectable()
export class BlockchainAddressesService {
    constructor(
        @InjectRepository(BlockchainAddress)
        private readonly blockchainAddressRepository: Repository<BlockchainAddress>,
    ) {}

    async create(blockchainAddress: BlockchainAddress): Promise<BlockchainAddress> {
        const hasPrimaryAddress = await this.hasPrimaryAddress(blockchainAddress.user!.id)
        if (blockchainAddress.isPrimary && hasPrimaryAddress) {
            throw new ConflictException("Can't have two primary addresses")
        } else if (!blockchainAddress.isPrimary && !hasPrimaryAddress) {
            throw new BadRequestException("Can\t create secondary address if there isn't a primary one")
        }
        const createdAddress = await this.blockchainAddressRepository.save(blockchainAddress)
        return (await this.blockchainAddressRepository.findOne(createdAddress.id))!
    }

    async findByUserId(userId: string): Promise<BlockchainAddress[]> {
        return await this.blockchainAddressRepository
            .createQueryBuilder('blockchainAddress')
            .leftJoinAndSelect('blockchainAddress.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany()
    }

    async doesAddressExist(address: string): Promise<boolean> {
        const existingAddress = await this.blockchainAddressRepository.findOne({ address })
        return !!existingAddress
    }

    async hasAnyAddresses(userId: string): Promise<boolean> {
        const blockchainAddresses = await this.findByUserId(userId)
        return blockchainAddresses.length > 0
    }

    async hasPrimaryAddress(userId: string): Promise<boolean> {
        const blockchainAddresses = await this.findByUserId(userId)
        return !!blockchainAddresses.find((bAddress) => bAddress.isPrimary)
    }

    async deleteAddress(blockchainAddress: BlockchainAddress) {
        if (blockchainAddress.isPrimary) {
            throw new BadRequestException("Can't delete primary address")
        }
        await this.blockchainAddressRepository.remove(blockchainAddress)
    }

    async makePrimary(userId: string, address: string) {
        const addresses = await this.findByUserId(userId)
        const adjustedAddresses = addresses.map((blockchainAddress: BlockchainAddress) => {
            return {
                ...blockchainAddress,
                isPrimary: blockchainAddress.address === address,
            }
        })
        await this.blockchainAddressRepository.save(adjustedAddresses)
    }
}
