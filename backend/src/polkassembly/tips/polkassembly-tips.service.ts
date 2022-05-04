import { Injectable } from '@nestjs/common'
import { GetPosts, PolkassemblyService } from '../polkassembly.service'
import { TipsPosts, TipsPostsCount } from './tip.fragment'
import { getLogger } from '../../logging.module'
import { Nil } from '../../utils/types'
import { PolkassemblyTipPostDto } from './tip-post.dto'
import { PolkassemblyTipPostSchema } from './tip-post.schema'
import { TreasuryProposalPostsCount } from '../treasury-proposals/proposal.fragments'

const logger = getLogger()
export type GetTipsPosts = Omit<GetPosts, 'includeIndexes' | 'excludeIndexes' | 'proposers'> & {
    includeHashes?: Nil<string[]>
    excludeHashes?: Nil<string[]>
    finderAddresses?: Nil<string[]>
}

@Injectable()
export class PolkassemblyTipsService {
    constructor(private readonly polkassemblyService: PolkassemblyService) {}

    async find({ networkId, paginatedParams, ...queryVariables }: GetTipsPosts): Promise<PolkassemblyTipPostDto[]> {
        try {
            const limit = paginatedParams?.pageSize ?? queryVariables.includeHashes?.length ?? 200
            const offset = paginatedParams ? paginatedParams.offset : 0
            logger.info('Looking for TreasuryTipPosts for ', { ...queryVariables, networkId, limit, offset })
            const data = await this.polkassemblyService.executeQuery(networkId, TipsPosts, {
                ...queryVariables,
                limit,
                offset,
            })
            return data?.posts.map((post: PolkassemblyTipPostSchema) => new PolkassemblyTipPostDto(post)) ?? []
        } catch (err) {
            logger.error('Error when looking for TreasuryTipPosts', err)
            return []
        }
    }

    async count({ networkId, ...queryVariables }: GetTipsPosts): Promise<number> {
        logger.info('Looking for TreasuryTipPostsCount for:', { ...queryVariables, networkId })
        try {
            const data = await this.polkassemblyService.executeQuery(networkId, TipsPostsCount, queryVariables)
            return data.onchain_links_aggregate.aggregate.count as number
        } catch (err) {
            logger.error('Error when looking for TreasuryTipPostsCount', err)
            return -1
        }
        return Promise.resolve(-1)
    }
}
