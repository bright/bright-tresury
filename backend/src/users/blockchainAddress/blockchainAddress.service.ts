import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BlockchainAddress} from "./blockchainAddress.entity";
import {isValidAddress} from "../../utils/address/address.validator";

@Injectable()
export class BlockchainAddressService {
    constructor(
        @InjectRepository(BlockchainAddress)
        private readonly blockchainAddressRepository: Repository<BlockchainAddress>
    ) {
    }

    async create(blockchainAddress: BlockchainAddress): Promise<BlockchainAddress> {
        const createdAddress = await this.blockchainAddressRepository.save(blockchainAddress)
        return (await this.blockchainAddressRepository.findOne(createdAddress.id))!
    }

    async validateAddress(address: string): Promise<boolean> {
        const isValid = isValidAddress(address)
        if (!isValid) {
            return false
        }
        const existingAddress = await this.blockchainAddressRepository.findOne({address})
        return !existingAddress
    }

}
