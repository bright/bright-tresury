import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import Extrinsic from '@polkadot/types/extrinsic/Extrinsic'
import { EventRecord, Header } from '@polkadot/types/interfaces'
import { extractTime } from '@polkadot/util'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { getLogger } from '../logging.module'
import { BlockchainProposal, BlockchainProposalStatus } from './dto/blockchain-proposal.dto'
import { DeriveAccountRegistration } from '@polkadot/api-derive/accounts/types'
import type { BlockNumber } from '@polkadot/types/interfaces/runtime'
import { getProposers, getBeneficiaries, getVoters, getApi, extractNumberFromBlockchainEvent } from './utils'
import BN from 'bn.js'
import { BlockchainProposalMotionEnd } from './dto/blockchain-proposal-motion-end.dto'
import { BlockchainsConnections } from './blockchain.module'
import { AccountId } from '@polkadot/types/interfaces/runtime'
import { BN_MILLION, BN_ZERO, u8aConcat } from '@polkadot/util'
import { StatsDto } from '../stats/stats.dto'
import { GetProposalsCountDto } from '../stats/get-proposals-count.dto'
import { GetSpendPeriodCalculationsDto } from '../stats/get-spend-period-calculations.dto'
import { BlockchainTimeLeft } from './dto/blockchain-time-left.dto'
import { BlockchainConfig, BlockchainConfigToken } from './blockchain-configuration/blockchain-configuration.config'
import { NetworkPlanckValue } from '../utils/types'

const logger = getLogger()

@Injectable()
export class BlockchainService implements OnModuleDestroy {
    private unsub?: () => void

    constructor(
        @Inject('PolkadotApi') private readonly blockchainsConnections: BlockchainsConnections,
        @Inject(BlockchainConfigToken) private readonly blockchainsConfiguration: BlockchainConfig[],
    ) {}

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
    ): Promise<void> {
        logger.info(`Listening for extrinsic with hash ${extrinsicHash}...`)
        let blocksCount = 0
        const api = getApi(this.blockchainsConnections, networkId)
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
                const events = (await api.query.system.events.at(header.hash)) as EventRecord[]
                logger.info(`All extrinsic events.`, events)
                await this.callUnsub()

                const applyExtrinsicEvents = BlockchainService.getApplyExtrinsicEvents(events)

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

    static getApplyExtrinsicEvents(events: EventRecord[]): ExtrinsicEvent[] {
        return events
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
    }

    async getIdentities(networkId: string, addresses: string[]): Promise<Map<string, DeriveAccountRegistration>> {
        logger.info('Getting identities from blockchain')
        const api = getApi(this.blockchainsConnections, networkId)
        const identities = new Map<string, DeriveAccountRegistration>()
        for (const address of addresses) {
            identities.set(address, await api.derive.accounts.identity(address))
        }
        return identities
    }

    getRemainingTime(
        networkId: string,
        currentBlockNumber: BlockNumber,
        futureBlockNumber: BlockNumber,
    ): BlockchainProposalMotionEnd {
        const remainingBlocks = futureBlockNumber.sub(currentBlockNumber)
        const timeLeft = this.blocksToTime(networkId, remainingBlocks)
        return new BlockchainProposalMotionEnd({
            endBlock: futureBlockNumber.toNumber(),
            remainingBlocks: remainingBlocks.toNumber(),
            timeLeft,
        })
    }

    async getProposals(networkId: string): Promise<BlockchainProposal[]> {
        logger.info(`Getting proposals from blockchain for networkId: ${networkId}`)
        const api = getApi(this.blockchainsConnections, networkId)
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

    extractProposalIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a blockchain proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'treasury', 'Proposed', 'ProposalIndex')
    }

    async getStats(networkId: string): Promise<StatsDto> {
        const [proposalsCount, spendPeriodCalculations, budget] = await Promise.all([
            this.getProposalsCount(networkId),
            this.getSpendPeriodCalculations(networkId),
            this.getBudget(networkId),
        ])
        const { submitted, approved, rejected } = proposalsCount
        const { spendPeriod, timeLeft, leftOfSpendingPeriod } = spendPeriodCalculations
        const { availableBalance, nextFoundsBurn } = budget

        return {
            submitted,
            approved,
            rejected,
            spendPeriod,
            timeLeft,
            leftOfSpendingPeriod,
            availableBalance,
            nextFoundsBurn,
        }
    }

    async getProposalsCount(networkId: string): Promise<GetProposalsCountDto> {
        const api = getApi(this.blockchainsConnections, networkId)
        const { proposals, approvals } = await api.derive.treasury.proposals()
        const rejectedObject = await api.events.treasury.Rejected.meta.args
        const submitted = proposals.length
        const approved = approvals.length
        const rejected = rejectedObject.length

        return {
            submitted,
            approved,
            rejected,
        }
    }

    async getSpendPeriodCalculations(networkId: string): Promise<GetSpendPeriodCalculationsDto> {
        const api = getApi(this.blockchainsConnections, networkId)
        const spendPeriodAsObject = await api.consts.treasury.spendPeriod
        const spendPeriodAsNumber = spendPeriodAsObject.toNumber()
        const spendPeriod = this.blocksToTime(networkId, spendPeriodAsObject)

        const bestNumber = await api.derive.chain.bestNumber()
        const numberOfUsedBlocks = bestNumber.mod(spendPeriodAsObject)
        const blocksLeft = spendPeriodAsObject.sub(numberOfUsedBlocks)
        const blocksLeftAsNumber = blocksLeft.toNumber()
        const timeLeft = this.blocksToTime(networkId, blocksLeft)

        const leftOfSpendingPeriodAsString = ((100 * blocksLeftAsNumber) / spendPeriodAsNumber).toFixed()
        const leftOfSpendingPeriod = Number(leftOfSpendingPeriodAsString)

        return {
            spendPeriod,
            timeLeft,
            leftOfSpendingPeriod,
        }
    }

    getBlockTime(networkId: string) {
        const DEFAULT_TIME = new BN(6000) // 6s - Source: https://wiki.polkadot.network/docs/en/faq#what-is-the-block-time-of-the-relay-chain
        const api = getApi(this.blockchainsConnections, networkId)

        return (
            api.consts.babe?.expectedBlockTime ||
            api.consts.difficulty?.targetBlockTime ||
            api.consts.timestamp?.minimumPeriod.muln(2) ||
            DEFAULT_TIME
        )
    }

    blocksToTime(networkName: string, numberOfBlocks: BN): BlockchainTimeLeft {
        const milliseconds = numberOfBlocks.mul(this.getBlockTime(networkName)).toNumber()
        return extractTime(Math.abs(milliseconds))
    }

    async getBudget(networkId: string) {
        const EMPTY_U8A_32 = new Uint8Array(32)
        const api = getApi(this.blockchainsConnections, networkId)
        const treasuryAccount = u8aConcat(
            'modl',
            api.consts.treasury && api.consts.treasury.palletId ? api.consts.treasury.palletId.toU8a(true) : 'py/trsry',
            EMPTY_U8A_32,
        ).subarray(0, 32) as AccountId

        const treasuryBalance = await api.derive.balances?.account(treasuryAccount)

        const burn =
            treasuryBalance.freeBalance.gt(BN_ZERO) && !api.consts.treasury.burn.isZero()
                ? api.consts.treasury.burn.mul(treasuryBalance.freeBalance).div(BN_MILLION)
                : BN_ZERO

        const nextFoundsBurn = burn.toString() as NetworkPlanckValue

        const treasuryAvailableBalance = treasuryBalance.freeBalance.gt(BN_ZERO)
            ? treasuryBalance.freeBalance
            : new BN(0)

        const availableBalance = treasuryAvailableBalance.toString() as NetworkPlanckValue

        return {
            availableBalance,
            nextFoundsBurn,
        }
    }
}
