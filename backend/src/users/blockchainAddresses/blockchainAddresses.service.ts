import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainAddress } from './blockchainAddress.entity'
import { CreateBlockchainAddress } from './create-blockchain-address'

@Injectable()
export class BlockchainAddressesService {
    constructor(
        @InjectRepository(BlockchainAddress)
        private readonly blockchainAddressRepository: Repository<BlockchainAddress>,
    ) {}

    async create(createBlockchainAddress: CreateBlockchainAddress): Promise<BlockchainAddress> {
        const isPrimary = !(await this.hasAnyAddresses(createBlockchainAddress.user!.id))
        const blockchainAddress = new BlockchainAddress(
            createBlockchainAddress.address,
            createBlockchainAddress.user!,
            isPrimary,
        )
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
