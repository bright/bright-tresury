import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import { ApiPromise } from '@polkadot/api'
import Extrinsic from '@polkadot/types/extrinsic/Extrinsic'
import { EventRecord, Header } from '@polkadot/types/interfaces'
import { extractTime } from '@polkadot/util'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { getLogger } from '../logging.module'
import { BlockchainProposal, BlockchainProposalStatus } from './dto/blockchain-proposal.dto'
import { DeriveAccountRegistration } from '@polkadot/api-derive/accounts/types'
import type { BlockNumber } from '@polkadot/types/interfaces/runtime'
import { getProposers, getBeneficiaries, getVoters } from './utils'
import BN from 'bn.js'
import { BlockchainProposalMotionEnd } from './dto/blockchain-proposal-motion-end.dto'
import { BlockchainsConnections } from './blockchain.module'
const logger = getLogger()

@Injectable()
export class BlockchainService implements OnModuleDestroy {
    private unsub?: () => void

    constructor(@Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections) {}

    getApi(networkId: string): ApiPromise {
        logger.info(`possible network ids: ${Object.keys(this.blockchainsConnections)} searching for ${networkId}`)
        if (Object.keys(this.blockchainsConnections).indexOf(networkId) === -1) {
            throw new Error(`Unrecognized network id: ${networkId}`)
        }
        return this.blockchainsConnections[networkId].apiPromise
    }

    async onModuleDestroy() {
        await this.callUnsub()
    }

    async callUnsub() {
        await this.unsub?.()
        this.unsub = undefined
    }

    async listenForExtrinsic(
        networkId: string,
        extrinsicHash: string,
        cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
    ) {
        logger.info(`Listening for extrinsic with hash ${extrinsicHash}...`)
        let blocksCount = 0
        const api = this.getApi(networkId)
        // TODO: Inspect the "overload" ts-lint issue
        // @ts-ignore
        this.unsub = await api.rpc.chain.subscribeNewHeads(async (header: Header) => {
            blocksCount++
            logger.info(`Checking block ${header.hash.toString()} No ${header.number}.`)
            const signedBlock = await api.rpc.chain.getBlock(header.hash)
            // TODO fix types!
            // @ts-ignore
            const extrinsic: Extrinsic | undefined = signedBlock.block.extrinsics.find(
                (ex) => ex.hash.toString() === extrinsicHash,
            )
            if (extrinsic) {
                logger.info(`Block with extrinsic ${extrinsicHash} found.`)
                const events = ((await api.query.system.events.at(header.hash)) as unknown) as EventRecord[]
                logger.info(`All extrinsic events.`, events)
                await this.callUnsub()

                const applyExtrinsicEvents = events
                    .filter(({ phase, event }) => phase.isApplyExtrinsic)
                    .map(({ event }) => {
                        const types = event.typeDef
                        return {
                            section: event.section,
                            method: event.method,
                            data: event.data.map((value, index) => {
                                return {
                                    name: types[index].type,
                                    value: value.toString(),
                                }
                            }),
                        } as ExtrinsicEvent
                    })

                logger.info(`Apply extrinsic events.`, applyExtrinsicEvents)

                const method = extrinsic.method.toJSON() as { args?: unknown }
                const args = method?.args ?? {}

                const result = {
                    blockHash: header.hash.toString(),
                    events: applyExtrinsicEvents,
                    data: args,
                } as UpdateExtrinsicDto

                logger.info(`Data extracted, calling the callback function...`, result)

                await cb(result)
            }

            // stop listening to blocks after some time - we assume the block might not be found
            // TODO set the threshold to some reasonable value
            if (blocksCount >= 50) {
                logger.error(`Extrinsic ${extrinsicHash} not found within 50 blocks`)
                await this.callUnsub()
            }
        })
    }

    async getIdentities(networkId: string, addresses: string[]): Promise<Map<string, DeriveAccountRegistration>> {
        logger.info('Getting identities from blockchain')
        const identities = new Map<string, DeriveAccountRegistration>()
        for (const address of addresses) {
            identities.set(address, await this.getApi(networkId).derive.accounts.identity(address))
        }
        return identities
    }

    getRemainingTime(
        networkId: string,
        currentBlockNumber: BlockNumber,
        futureBlockNumber: BlockNumber,
    ): BlockchainProposalMotionEnd {
        const DEFAULT_BLOCK_TIME = 6000 // 6s - Source: https://wiki.polkadot.network/docs/en/faq#what-is-the-block-time-of-the-relay-chain
        const { babe, difficulty, timestamp } = this.getApi(networkId).consts
        const blockTime =
            babe?.expectedBlockTime ??
            difficulty?.targetBlockTime ??
            timestamp?.minimumPeriod.muln(2) ??
            new BN(DEFAULT_BLOCK_TIME)
        const remainingBlocks = futureBlockNumber.sub(currentBlockNumber)
        const remainingMilliseconds = blockTime.mul(remainingBlocks).toNumber()
        const timeLeft = extractTime(Math.abs(remainingMilliseconds))
        return new BlockchainProposalMotionEnd({
            endBlock: futureBlockNumber.toNumber(),
            remainingBlocks: remainingBlocks.toNumber(),
            timeLeft,
        })
    }

    async getProposals(networkId: string): Promise<BlockchainProposal[]> {
        logger.info(`Getting proposals from blockchain for networkId: ${networkId}`)
        const api = this.getApi(networkId)
        const { proposals, proposalCount, approvals } = await api.derive.treasury.proposals()

        const proposalCountNumber = proposalCount.toNumber()
        logger.info(`ProposalCount is ${proposalCountNumber}.`)
        if (proposalCountNumber === 0) {
            return []
        }

        logger.info('Getting voters')

        // get unique (set) accountIds as strings (toHuman) from ongoing proposals and approvals
        const addresses = new Set(
            [
                ...getProposers(proposals),
                ...getProposers(approvals),
                ...getBeneficiaries(proposals),
                ...getBeneficiaries(approvals),
                ...getVoters(proposals),
                ...getVoters(approvals),
            ].map((accountId) => accountId.toHuman()),
        )
        const identities = await this.getIdentities(networkId, Array.from(addresses))

        // make a function that will compute remaining voting time
        const currentBlockNumber = await api.derive.chain.bestNumber()
        const toBlockchainProposalMotionEnd = (endBlock: BlockNumber): BlockchainProposalMotionEnd =>
            this.getRemainingTime(networkId, currentBlockNumber, endBlock)

        return [
            ...proposals.map((derivedProposal) =>
                BlockchainProposal.create(
                    derivedProposal,
                    BlockchainProposalStatus.Proposal,
                    identities,
                    toBlockchainProposalMotionEnd,
                ),
            ),
            ...approvals.map((derivedProposal) =>
                BlockchainProposal.create(
                    derivedProposal,
                    BlockchainProposalStatus.Approval,
                    identities,
                    toBlockchainProposalMotionEnd,
                ),
            ),
        ]
    }

    extractBlockchainProposalIndexFromExtrinsicEvents(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a blockchain proposal index')
        logger.info('Extracting event from extrinsicEvents with section: treasury, method: Proposed')

        const event = extrinsicEvents.find(({ section, method }) => section === 'treasury' && method === 'Proposed')

        if (event) {
            logger.info('Event found')

            const proposalIndex = Number(event?.data.find(({ name }) => name === 'ProposalIndex')?.value)

            logger.info(`Found blockchain proposal index: ${proposalIndex}`)

            if (!isNaN(proposalIndex)) {
                return proposalIndex
            }

            logger.info('Found blockchain proposal index is NaN')
        }

        logger.info('Event not found')

        return
    }
}
