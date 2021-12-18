import { Injectable } from '@nestjs/common'
import BN from 'bn.js'
import { GraphQLClient } from 'graphql-request'
import { BlockchainConfigurationService } from '../blockchain/blockchain-configuration/blockchain-configuration.service'
import { BlockchainService } from '../blockchain/blockchain.service'
import { MotionTimeDto } from '../blockchain/dto/motion-time.dto'
import { getLogger } from '../logging.module'
import { Nil } from '../utils/types'

import {
    OffChainTreasuryProposalPosts,
    OnChainTreasuryProposalPosts,
    OneTreasuryProposalPost,
} from './fragments/proposal.fragments'
import { PolkassemblyTreasuryProposalPostDto } from './dto/treasury-proposal-post.dto'
import { PolkassemblyBountyPostDto } from './dto/bounty-post.dto'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { PolkassemblyTreasuryProposalPostSchema } from './schemas/treasury-proposal-post.schema'
import { PolkassemblyBountyPostSchema } from './schemas/bounty-post.schema'
import { ExecutedMotionDto } from './dto/executed-motion.dto'
import { Motions } from './fragments/motion.fragments'
import { MotionSchema } from './schemas/motion.schema'
import { OffChainBountyPosts, OnChainBountyPosts, OneBountyPost } from './fragments/bounty.fragments'

const logger = getLogger()

interface GetPosts {
    indexes: number[]
    networkId: string
    onChain: boolean
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

    private async executeQuery(networkId: string, query: string, variables: any) {
        const client = this.graphQLClients[networkId]
        if (!client) return
        return client.request(query, variables)
    }

    async getBountyMotions(bountyIndex: number, networkId: string): Promise<ExecutedMotionDto[]> {
        return this.getMotions('bounty_id', bountyIndex.toString(), networkId)
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

    async getProposal(proposalIndex: number, networkId: string): Promise<Nil<PolkassemblyTreasuryProposalPostDto>> {
        logger.info('Looking for TreasuryProposalPost for proposal index and networkId', proposalIndex, networkId)
        try {
            const data = await this.executeQuery(networkId, OneTreasuryProposalPost, { id: proposalIndex })
            const post: PolkassemblyTreasuryProposalPostSchema = data?.posts?.[0]
            return post ? new PolkassemblyTreasuryProposalPostDto(post) : undefined
        } catch (err) {
            getLogger().error('Error when looking for TreasuryProposalPost', err)
        }
    }

    async getProposals({
        indexes,
        networkId,
        onChain,
        paginatedParams,
    }: GetPosts): Promise<PolkassemblyTreasuryProposalPostDto[]> {
        logger.info('Looking for TreasuryProposalPosts for proposal indexes and networkId', indexes, networkId)
        try {
            const query = onChain ? OnChainTreasuryProposalPosts : OffChainTreasuryProposalPosts
            const variables = {
                ids: indexes,
                limit: paginatedParams ? paginatedParams.pageSize : indexes.length,
                offset: paginatedParams ? paginatedParams.offset : 0,
            }
            const data = await this.executeQuery(networkId, query, variables)
            return (
                data?.posts?.map(
                    (post: PolkassemblyTreasuryProposalPostSchema) => new PolkassemblyTreasuryProposalPostDto(post),
                ) ?? []
            )
        } catch (err) {
            getLogger().error('Error when looking for TreasuryProposalPosts', err)
            return []
        }
    }

    async getBounty(bountyIndex: number, networkId: string): Promise<Nil<PolkassemblyBountyPostDto>> {
        const client = this.graphQLClients[networkId]
        if (!client) return
        getLogger().info('Looking for BountyPost for bounty index and networkId', bountyIndex, networkId)
        try {
            const data = await this.executeQuery(networkId, OneBountyPost, { id: bountyIndex })
            const post: PolkassemblyBountyPostSchema = data?.posts?.[0]
            return post ? new PolkassemblyBountyPostDto(post) : undefined
        } catch (err) {
            getLogger().error('Error when looking for BountyPost', err)
        }
    }

    async getBounties({
        indexes,
        networkId,
        onChain,
        paginatedParams,
    }: GetPosts): Promise<PolkassemblyBountyPostDto[]> {
        try {
            getLogger().info('Looking for BountyPosts for bounties indexes and networkId', indexes, networkId, onChain)
            const query = onChain ? OnChainBountyPosts : OffChainBountyPosts
            const data = await this.executeQuery(networkId, query, {
                ids: indexes,
                limit: paginatedParams ? paginatedParams.pageSize : indexes.length,
                offset: paginatedParams ? paginatedParams.offset : 0,
            })
            return data?.posts.map((post: PolkassemblyBountyPostSchema) => new PolkassemblyBountyPostDto(post)) ?? []
        } catch (err) {
            getLogger().error('Error when looking for BountyPosts', err)
            return []
        }
    }
}
