import { Inject, Injectable } from '@nestjs/common'
// import { ApiPromise } from '@polkadot/api'
import { getLogger } from '../logging.module'
import { BlockchainConfig } from './blockchain.config'
import { ApiPromise } from '@polkadot/api'

const logger = getLogger()
@Injectable()
export class BlockchainService {
  constructor(
    @Inject('PolkadotApi') private readonly polkadotApi: ApiPromise,
    @Inject('BlockchainConfig') private readonly blockchainConfig: BlockchainConfig,
  ) { }

  // TODO import useres into keyring
  // async deployContract(transactionId: string): Promise<string | undefined> {
  //   const contract = new this.web3.eth.Contract(abi.abi as AbiItem[])

  //   const newContract = await contract.deploy({ data: abi.bytecode, arguments: [transactionId] }).send({
  //     from: contractOwner.contractOwnerAddress,
  //     gas: 3000000,
  //     gasPrice: '0',
  //   })
  //   return newContract.options.address
  // }
  getUrl(): string {
    return this.blockchainConfig.nodeUrl
  }
}
