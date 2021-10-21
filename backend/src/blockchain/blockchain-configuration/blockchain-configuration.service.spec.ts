import { beforeAllSetup } from '../../utils/spec.helpers'
import { Test } from '@nestjs/testing'
import { BlockchainModule } from '../blockchain.module'

import { BlockchainConfigurationService } from './blockchain-configuration.service'
import { BadRequestException } from '@nestjs/common'

describe(`blockchain-configuration service`, () => {
    const module = beforeAllSetup(
        async () =>
            await Test.createTestingModule({
                imports: [BlockchainModule],
            }).compile(),
    )
    const service = beforeAllSetup(() => module().get<BlockchainConfigurationService>(BlockchainConfigurationService))

    it('should throw BadRequestException when asked for non existing networkId', () => {
        expect(() => service().getBlockchainConfiguration('BAD_NETWORK_ID')).toThrow(BadRequestException)
    })
})
