import { Injectable } from '@nestjs/common'
import { GraphQLClient } from 'graphql-request'
import { BountyPost, BountyPosts, TreasuryProposalPost, TreasuryProposalPosts } from './polkassembly.fragments'
import { BlockchainConfigurationService } from '../blockchain/blockchain-configuration/blockchain-configuration.service'
import { getLogger } from '../logging.module'
import { PolkassemblyPostDto } from './dto/polkassembly-post.dto'
import { Nil } from '../utils/types'
import { PolkassemblyPostEventDto } from './dto/polkassembly-post-event.dto'

const logger = getLogger()

@Injectable()
export class PolkassemblyService {
    private readonly graphQLClients: { [key: string]: GraphQLClient | undefined }
    constructor(blockchainConfigurationService: BlockchainConfigurationService) {
        this.graphQLClients = blockchainConfigurationService.getBlockchainsConfigurations().reduce((acc, cur) => {
            logger.info('Creating graphql client for networkId and url', cur.id, cur.polkassemblyUrl)
            if (cur.polkassemblyUrl) acc[cur.id] = new GraphQLClient(cur.polkassemblyUrl)
            return acc
        }, {} as { [key: string]: GraphQLClient })
    }

    async getProposal(proposalIndex: number, networkId: string): Promise<Nil<PolkassemblyPostDto>> {
        const client = this.graphQLClients[networkId]
        if (!client) return
        logger.info('Looking for TreasuryProposalPost for proposal index and networkId', proposalIndex, networkId)
        try {
            const data = await client.request(TreasuryProposalPost, { id: proposalIndex })
            const post = data?.posts?.[0]
            if (!post) {
                return
            }
            return PolkassemblyService.fromPolkassemblyProposalPost(post)
        } catch (err) {
            getLogger().error('Error when looking for TreasuryProposalPost', err)
        }
    }

    async getProposals(proposalIndexes: number[], networkId: string): Promise<PolkassemblyPostDto[]> {
        const client = this.graphQLClients[networkId]
        if (!client) return []
        getLogger().info(
            'Looking for TreasuryProposalPosts for proposal indexes and networkId',
            proposalIndexes,
            networkId,
        )
        try {
            const data = await client.request(TreasuryProposalPosts, { ids: proposalIndexes })
            return data.posts?.map(PolkassemblyService.fromPolkassemblyProposalPost) ?? []
        } catch (err) {
            getLogger().error('Error when looking for TreasuryProposalPosts', err)
            return []
        }
    }

    async getBounty(bountyIndex: number, networkId: string): Promise<Nil<PolkassemblyPostDto>> {
        const client = this.graphQLClients[networkId]
        if (!client) return
        getLogger().info('Looking for BountyPost for bounty index and networkId', bountyIndex, networkId)
        try {
            const data = await client.request(BountyPost, { id: bountyIndex })
            const post = data?.posts?.[0]
            if (!post) {
                return
            }
            getLogger().info('Polkassembly BountyPost for bounty index and networkId', bountyIndex, networkId, post)
            return PolkassemblyService.fromPolkassemblyBountyPost(post)
        } catch (err) {
            getLogger().error('Error when looking for BountyPost', err)
        }
    }

    async getBounties(bountiesIndexes: number[], networkId: string): Promise<PolkassemblyPostDto[]> {
        if (!bountiesIndexes.length) return []
        const client = this.graphQLClients[networkId]
        if (!client) return []
        try {
            getLogger().info('Looking for BountyPosts for bounties indexes and networkId', bountiesIndexes, networkId)
            const data = await client.request(BountyPosts, { ids: bountiesIndexes })
            return data?.posts.map(PolkassemblyService.fromPolkassemblyBountyPost) ?? []
        } catch (err) {
            getLogger().error('Error when looking for BountyPosts', err)
            return []
        }
    }

    private static fromPolkassemblyProposalPost = (post: any) =>
        new PolkassemblyPostDto({
            title: post.title,
            content: post.content,
            blockchainIndex: post.onchain_link.onchain_treasury_proposal_id,
        })

    private static fromPolkassemblyBountyPost = (post: any) =>
        new PolkassemblyPostDto({
            title: post.title,
            content: post.content,
            blockchainIndex: post.onchain_link.onchain_bounty_id,
            events: post.onchain_link.onchain_bounty[0]?.bountyStatus?.map(
                (bountyStatus: any) =>
                    new PolkassemblyPostEventDto({
                        eventName: bountyStatus.status,
                        blockNumber: bountyStatus.blockNumber.number,
                        blockDateTime: bountyStatus.blockNumber.startDateTime,
                    }),
            ),
        })
}
