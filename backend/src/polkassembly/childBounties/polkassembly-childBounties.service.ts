import { getLogger } from '../../logging.module'
import { Injectable } from '@nestjs/common'
import { GetPosts, PolkassemblyService } from '../polkassembly.service'
import { Nil } from '../../utils/types'
import { PolkassemblyChildBountyPostDto } from './childBounty-post.dto'
import { PolkassemblyChildBountyPostSchema } from './childBounty-post.shema'
import { ChildBountyPosts, OneChildBountyPost } from './childBounty.fragment'
import { ChildBountyId } from '../../blockchain/blockchain-child-bounties/child-bounty-id.interface'

const logger = getLogger()

@Injectable()
export class PolkassemblyChildBountiesService {
    constructor(private readonly polkassemblyService: PolkassemblyService) {}
    async findOne(childBountyId: number, networkId: string): Promise<Nil<PolkassemblyChildBountyPostDto>> {
        logger.info('Looking for ChildBountyPost for childBountyId and networkId', childBountyId, networkId)
        try {
            const data = await this.polkassemblyService.executeQuery(networkId, OneChildBountyPost, {
                id: childBountyId,
            })
            const post: PolkassemblyChildBountyPostSchema = data?.posts?.[0]
            return post ? new PolkassemblyChildBountyPostDto(post) : undefined
        } catch (err) {
            logger.error('Error when looking for ChildBountyPost', err)
        }
    }

    async find({ networkId, paginatedParams, ...queryVariables }: GetPosts): Promise<PolkassemblyChildBountyPostDto[]> {
        try {
            logger.info('Looking for ChildBountyPosts for ', { ...queryVariables, networkId })
            const data = await this.polkassemblyService.executeQuery(networkId, ChildBountyPosts, queryVariables)
            return (
                data?.posts.map(
                    (post: PolkassemblyChildBountyPostSchema) => new PolkassemblyChildBountyPostDto(post),
                ) ?? []
            )
        } catch (err) {
            logger.error('Error when looking for ChildBountyPosts', err)
            return []
        }
    }
}
