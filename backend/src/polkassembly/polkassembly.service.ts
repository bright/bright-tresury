import { Injectable } from '@nestjs/common'
import BN from 'bn.js'
import { GraphQLClient } from 'graphql-request'
import { BlockchainConfigurationService } from '../blockchain/blockchain-configuration/blockchain-configuration.service'
import { BlockchainService } from '../blockchain/blockchain.service'
import { MotionTimeDto } from '../blockchain/dto/motion-time.dto'
import { getLogger } from '../logging.module'
import { Nil } from '../utils/types'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { ExecutedMotionDto } from './dto/executed-motion.dto'
import { Motions } from './fragments/motion.fragments'
import { MotionSchema } from './schemas/motion.schema'

const logger = getLogger()

export interface GetPosts {
    includeIndexes?: Nil<number[]>
    excludeIndexes?: Nil<number[]>
    proposers?: Nil<string[]>
    networkId: string
    paginatedParams?: PaginatedParams
}

@Injectable()
export class PolkassemblyService {
    private readonly graphQLClients: { [key: string]: GraphQLClient | undefined }

    constructor(
        blockchainConfigurationService: BlockchainConfigurationService,
        private readonly blockchainService: BlockchainService,
    ) {
        this.graphQLClients = blockchainConfigurationService.getBlockchainsConfigurations().reduce((acc, cur) => {
            logger.info('Creating graphql client for networkId and url', cur.id, cur.polkassemblyUrl)
            if (cur.polkassemblyUrl) acc[cur.id] = new GraphQLClient(cur.polkassemblyUrl)
            return acc
        }, {} as { [key: string]: GraphQLClient })
    }

    async executeQuery(networkId: string, query: string, variables: any) {
        const client = this.graphQLClients[networkId]
        if (!client) return
        return client.request(query, variables)
    }

    async getMotions(argumentName: string, argumentValue: string, networkId: string): Promise<ExecutedMotionDto[]> {
        const client = this.graphQLClients[networkId]
        if (!client) return []
        logger.info(
            'Looking for Motions for argumentName, argumentValue and networkId',
            argumentName,
            argumentValue,
            networkId,
        )
        try {
            const data = await client.request(Motions, { argumentName, argumentValue })

            const currentBlock = await this.blockchainService.getCurrentBlockNumber(networkId)
            const toMotionTime = (pastBlock: BN): MotionTimeDto =>
                this.blockchainService.getPastTime(networkId, currentBlock, pastBlock)

            return data?.motions.map((motion: MotionSchema) => new ExecutedMotionDto(motion, toMotionTime))
        } catch (err) {
            getLogger().error('Error when looking for Motions', err)
            return []
        }
    }

}
