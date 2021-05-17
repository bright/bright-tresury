import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainAddress } from './blockchainAddress.entity'

@Injectable()
export class BlockchainAddressService {
    constructor(
        @InjectRepository(BlockchainAddress)
        private readonly blockchainAddressRepository: Repository<BlockchainAddress>,
    ) {}

    async create(blockchainAddress: BlockchainAddress): Promise<BlockchainAddress> {
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
}
