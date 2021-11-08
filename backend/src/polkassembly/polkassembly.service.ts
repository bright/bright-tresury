import { Injectable } from '@nestjs/common'
import { GraphQLClient } from 'graphql-request'
import { TreasuryProposalPost, TreasuryProposalPosts } from './polkassembly.fragments'
import { BlockchainConfigurationService } from '../blockchain/blockchain-configuration/blockchain-configuration.service'
import { getLogger } from '../logging.module'
import { PolkassemblyProposalDto } from './polkassembly-proposal.dto'
import { Nil } from '../utils/types'

const logger = getLogger()

@Injectable()
export class PolkassemblyService {
    private readonly graphQLClients: {[key: string]: (GraphQLClient | undefined)}
    constructor(blockchainConfigurationService: BlockchainConfigurationService
    ){
        this.graphQLClients = blockchainConfigurationService.getBlockchainsConfigurations()
            .reduce((acc, cur) => {
                logger.info('Creating graphql client for network id and url', cur.id, cur.polkassemblyUrl)
                if(cur.polkassemblyUrl)
                    acc[cur.id] = new GraphQLClient(cur.polkassemblyUrl)
                return acc
            }, {} as {[key: string]: GraphQLClient})
    }

    async getTreasuryProposal(proposalIndex: number, networkId: string): Promise<Nil<PolkassemblyProposalDto>> {
        const client = this.graphQLClients[networkId]
        if(!client)
            return
        logger.info('Looking for TreasuryProposalPost for proposal index and networkId', proposalIndex, networkId)
        const data = await client.request(TreasuryProposalPost, {id: proposalIndex})
        const post = data?.posts ? data.posts[0] : undefined
        if (!post) {
            return;
        }
        return PolkassemblyService.toProposalPolkassemblyDto(post)
    }

    async getTreasuryProposals(proposalIndexes: number[], networkId: string): Promise<PolkassemblyProposalDto[]> {
        const client = this.graphQLClients[networkId]
        if(!client)
            return []
        getLogger().info('Looking for TreasuryProposalPosts for proposal indexes and networkId', proposalIndexes, networkId)
        const data = await client.request(TreasuryProposalPosts, {ids: proposalIndexes})
        return data.posts.map(PolkassemblyService.toProposalPolkassemblyDto)
    }
    private static toProposalPolkassemblyDto = (post:any) => new PolkassemblyProposalDto({
        title: post.title, content: post.content, proposalIndex: post.onchain_link.onchain_treasury_proposal_id
    })
}
