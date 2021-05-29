import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Web3Address } from './web3-address.entity'
import { CreateWeb3AddressDto } from './create-web3-address.dto'

@Injectable()
export class Web3AddressesService {
    constructor(
        @InjectRepository(Web3Address)
        private readonly web3AddressRepository: Repository<Web3Address>,
    ) {}

    async create(createWeb3Address: CreateWeb3AddressDto): Promise<Web3Address> {
        const isPrimary = !(await this.hasAnyAddresses(createWeb3Address.user!.id))
        const web3Address = new Web3Address(createWeb3Address.address, createWeb3Address.user!, isPrimary)
        const createdAddress = await this.web3AddressRepository.save(web3Address)
        return (await this.web3AddressRepository.findOne(createdAddress.id))!
    }

    async findByUserId(userId: string): Promise<Web3Address[]> {
        return await this.web3AddressRepository
            .createQueryBuilder('web3Address')
            .leftJoinAndSelect('web3Address.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany()
    }

    async doesAddressExist(address: string): Promise<boolean> {
        const existingAddress = await this.web3AddressRepository.findOne({ address })
        return !!existingAddress
    }

    async hasAnyAddresses(userId: string): Promise<boolean> {
        const web3Addresses = await this.findByUserId(userId)
        return web3Addresses.length > 0
    }

    async deleteAddress(web3Address: Web3Address) {
        if (web3Address.isPrimary) {
            throw new BadRequestException("Can't delete primary address")
        }
        await this.web3AddressRepository.remove(web3Address)
    }

    async makePrimary(userId: string, address: string) {
        const addresses = await this.findByUserId(userId)
        const adjustedAddresses = addresses.map((web3Address: Web3Address) => {
            return {
                ...web3Address,
                isPrimary: web3Address.address === address,
            }
        })
        await this.web3AddressRepository.save(adjustedAddresses)
    }
}
