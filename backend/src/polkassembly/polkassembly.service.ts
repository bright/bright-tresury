import { Injectable } from '@nestjs/common'
import { GraphQLClient } from 'graphql-request'
import { BountyPost, BountyPosts, TreasuryProposalPost, TreasuryProposalPosts } from './polkassembly.fragments'
import { BlockchainConfigurationService } from '../blockchain/blockchain-configuration/blockchain-configuration.service'
import { getLogger } from '../logging.module'
import { PolkassemblyPostDto } from './polkassembly-post.dto'
import { Nil } from '../utils/types'

const logger = getLogger()

@Injectable()
export class PolkassemblyService {
    private readonly graphQLClients: {[key: string]: (GraphQLClient | undefined)}
    constructor(blockchainConfigurationService: BlockchainConfigurationService
    ){
        this.graphQLClients = blockchainConfigurationService.getBlockchainsConfigurations()
            .reduce((acc, cur) => {
                logger.info('Creating graphql client for networkId and url', cur.id, cur.polkassemblyUrl)
                if(cur.polkassemblyUrl)
                    acc[cur.id] = new GraphQLClient(cur.polkassemblyUrl)
                return acc
            }, {} as {[key: string]: GraphQLClient})
    }

    async getProposal(proposalIndex: number, networkId: string): Promise<Nil<PolkassemblyPostDto>> {
        const client = this.graphQLClients[networkId]
        if(!client)
            return
        logger.info('Looking for TreasuryProposalPost for proposal index and networkId', proposalIndex, networkId)
        const data = await client.request(TreasuryProposalPost, {id: proposalIndex})
        const post = data?.posts?.[0]
        if (!post) {
            return;
        }
        return PolkassemblyService.fromPolkassemblyProposalPost(post)
    }

    async getProposals(proposalIndexes: number[], networkId: string): Promise<PolkassemblyPostDto[]> {
        const client = this.graphQLClients[networkId]
        if(!client)
            return []
        getLogger().info('Looking for TreasuryProposalPosts for proposal indexes and networkId', proposalIndexes, networkId)
        const data = await client.request(TreasuryProposalPosts, {ids: proposalIndexes})
        return data.posts.map(PolkassemblyService.fromPolkassemblyProposalPost)
    }

    async getBounty(bountyIndex: number, networkId: string): Promise<Nil<PolkassemblyPostDto>> {
        const client = this.graphQLClients[networkId]
        if(!client)
            return
        getLogger().info('Looking for BountyPost for bounty index and networkId', bountyIndex, networkId)
        const data = await client.request(BountyPost, {id: bountyIndex})
        const post = data?.posts?.[0]
        if (!post) {
            return;
        }
        return PolkassemblyService.fromPolkassemblyBountyPost(post)
    }

    async getBounties(bountiesIndexes: number[], networkId: string): Promise<PolkassemblyPostDto[]> {
        if (!bountiesIndexes.length)
            return []
        const client = this.graphQLClients[networkId]
        if(!client)
            return []
        getLogger().info('Looking for BountyPosts for bounties indexes and networkId', bountiesIndexes, networkId)
        const data = await client.request(BountyPosts, {ids: bountiesIndexes})
        return data.posts.map(PolkassemblyService.fromPolkassemblyBountyPost)
    }

    private static fromPolkassemblyProposalPost = (post:any) => new PolkassemblyPostDto({
        title: post.title, content: post.content, blockchainIndex: post.onchain_link.onchain_treasury_proposal_id
    })

    private static fromPolkassemblyBountyPost = (post: any) => new PolkassemblyPostDto({
        title: post.title, content: post.content, blockchainIndex: post.onchain_link.onchain_bounty_id
    })
}
