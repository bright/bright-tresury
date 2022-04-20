import { Injectable } from '@nestjs/common'
import { GetPosts, PolkassemblyService } from '../polkassembly.service'
import { TipsPosts } from './tip.fragment'
import { getLogger } from '../../logging.module'
import { Nil } from '../../utils/types'
import { PolkassemblyTipPostDto } from './tip-post.dto'
import { PolkassemblyTipPostSchema } from './tip-post.schema'

const logger = getLogger()
export type GetTipsPosts = Omit<GetPosts, 'includeIndexes' | 'excludeIndexes' | 'proposers'> & {
    includeHashes?: Nil<string[]>
    excludeHashes?: Nil<string[]>
}

@Injectable()
export class PolkassemblyTipsService {
    constructor(private readonly polkassemblyService: PolkassemblyService) {}

    async find({ networkId, paginatedParams, ...queryVariables }: GetTipsPosts) {
        try {
            logger.info('Looking for Tips for ', { ...queryVariables, networkId })

            const data = await this.polkassemblyService.executeQuery(networkId, TipsPosts, queryVariables)
            return data?.posts.map((post: PolkassemblyTipPostSchema) => new PolkassemblyTipPostDto(post)) ?? []
        } catch (err) {
            logger.error('Error when looking for TipsPosts', err)
            return []
        }
    }
}
