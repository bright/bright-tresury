import { Injectable } from '@nestjs/common'
import { getLogger } from '../../logging.module'
import { Nil } from '../../utils/types'
import { ExecutedMotionDto } from '../dto/executed-motion.dto'
import { GetPosts, PolkassemblyService } from '../polkassembly.service'
import {
    TreasuryProposalPosts,
    TreasuryProposalPostsCount,
    OneTreasuryProposalPost,
} from './proposal.fragments'
import { PolkassemblyTreasuryProposalPostDto } from './treasury-proposal-post.dto'
import { PolkassemblyTreasuryProposalPostSchema } from './treasury-proposal-post.schema'

const logger = getLogger()
const DEFAULT_LIMIT = 1000

@Injectable()
export class PolkassemblyTreasuryProposalsService {
    constructor(private readonly polkassemblyService: PolkassemblyService) {}

    async getProposalMotions(proposalIndex: number, networkId: string): Promise<ExecutedMotionDto[]> {
        return this.polkassemblyService.getMotions('proposal_id', proposalIndex.toString(), networkId)
    }

    async findOne(proposalIndex: number, networkId: string): Promise<Nil<PolkassemblyTreasuryProposalPostDto>> {
        logger.info('Looking for TreasuryProposalPost for proposal index and networkId', proposalIndex, networkId)
        try {
            const data = await this.polkassemblyService.executeQuery(networkId, OneTreasuryProposalPost, {
                id: proposalIndex,
            })
            const post: PolkassemblyTreasuryProposalPostSchema = data?.posts?.[0]
            return post ? new PolkassemblyTreasuryProposalPostDto(post) : undefined
        } catch (err) {
            logger.error('Error when looking for TreasuryProposalPost', err)
        }
    }

    async find({
        networkId,
        paginatedParams,
        ...queryVariables
    }: GetPosts): Promise<PolkassemblyTreasuryProposalPostDto[]> {
        logger.info('Looking for TreasuryProposalPosts for:', { ...queryVariables, networkId })

        try {
            const limit = paginatedParams?.pageSize ?? queryVariables.includeIndexes?.length ?? DEFAULT_LIMIT
            const offset = paginatedParams ? paginatedParams.offset : 0
            const data = await this.polkassemblyService.executeQuery(networkId, TreasuryProposalPosts, {
                ...queryVariables,
                limit,
                offset,
            })

            return (
                data?.posts?.map(
                    (post: PolkassemblyTreasuryProposalPostSchema) => new PolkassemblyTreasuryProposalPostDto(post),
                ) ?? []
            )
        } catch (err) {
            logger.error('Error when looking for TreasuryProposalPosts', err)
            return []
        }
    }

    async count({ networkId, ...queryVariables }: GetPosts): Promise<number> {
        logger.info('Looking for TreasuryProposalPostsCount for:', { ...queryVariables, networkId })
        try {
            const data = await this.polkassemblyService.executeQuery(networkId, TreasuryProposalPostsCount, queryVariables)
            return data.onchain_links_aggregate.aggregate.count as number
        } catch (err) {
            logger.error('Error when looking for TreasuryProposalPostsCount', err)
            return -1
        }
        return Promise.resolve(-1)
    }
}
