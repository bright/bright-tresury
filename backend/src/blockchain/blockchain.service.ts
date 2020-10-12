import { Inject, Injectable, Logger } from '@nestjs/common'
// import { ApiPromise } from '@polkadot/api'
import { getLogger } from '../logging.module'
import { BlockchainConfig } from './blockchain.config'
import { ApiPromise } from '@polkadot/api'
import { Bytes, Null, StorageKey, Text, bool, u32, u64 } from '@polkadot/types/primitive';

const logger = getLogger()
@Injectable()
export class BlockchainService {
  constructor(
    @Inject('PolkadotApi') private readonly polkadotApi: ApiPromise,
  ) { }

  async getName(): Promise<string> {
    const name: Text = await this.polkadotApi.rpc.system.name() as Text
    return name.toHuman()
  }
}
