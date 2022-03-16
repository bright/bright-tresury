import { Injectable } from '@nestjs/common'
import { getLogger } from '../../logging.module'
import { Nil } from '../../utils/types'
import { ExecutedMotionDto } from '../dto/executed-motion.dto'
import { GetPosts, PolkassemblyService } from '../polkassembly.service'
import { PolkassemblyBountyPostDto } from './bounty-post.dto'
import { PolkassemblyBountyPostSchema } from './bounty-post.schema'
import { BountyPosts, OneBountyPost } from './bounty.fragments'

const logger = getLogger()

@Injectable()
export class PolkassemblyBountiesService {
    constructor(private readonly polkassemblyService: PolkassemblyService) {}

    async findMotions(bountyIndex: number, networkId: string): Promise<ExecutedMotionDto[]> {
        return this.polkassemblyService.getMotions('bounty_id', bountyIndex.toString(), networkId)
    }

    async findOne(bountyIndex: number, networkId: string): Promise<Nil<PolkassemblyBountyPostDto>> {
        logger.info('Looking for BountyPost for bounty index and networkId', bountyIndex, networkId)
        try {
            const data = await this.polkassemblyService.executeQuery(networkId, OneBountyPost, { id: bountyIndex })
            const post: PolkassemblyBountyPostSchema = data?.posts?.[0]
            return post ? new PolkassemblyBountyPostDto(post) : undefined
        } catch (err) {
            logger.error('Error when looking for BountyPost', err)
        }
    }

    async find({ networkId, paginatedParams, ...queryVariables }: GetPosts): Promise<PolkassemblyBountyPostDto[]> {
        try {
            logger.info('Looking for BountyPosts for ', { ...queryVariables, networkId })
            const data = await this.polkassemblyService.executeQuery(networkId, BountyPosts, queryVariables)
            return data?.posts.map((post: PolkassemblyBountyPostSchema) => new PolkassemblyBountyPostDto(post)) ?? []
        } catch (err) {
            logger.error('Error when looking for BountyPosts', err)
            return []
        }
    }
}
