import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import Extrinsic from '@polkadot/types/extrinsic/Extrinsic'
import { EventRecord, Header } from '@polkadot/types/interfaces'
import { AccountId } from '@polkadot/types/interfaces/runtime'
import { BN_MILLION, BN_ZERO, extractTime, u8aConcat } from '@polkadot/util'
import BN from 'bn.js'
import { ServiceStatus } from '../app.dto'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { getLogger } from '../logging.module'
import { BlockchainProposal, BlockchainProposalStatus } from './dto/blockchain-proposal.dto'
import { DeriveAccountRegistration } from '@polkadot/api-derive/accounts/types'
import type { BlockNumber } from '@polkadot/types/interfaces/runtime'
import { getApi, extractNumberFromBlockchainEvent, getBlockchainConfiguration } from './utils'
import { BlockchainsConnections } from './blockchain.module'
import { StatsDto } from '../stats/stats.dto'
import { GetProposalsCountDto } from '../stats/get-proposals-count.dto'
import { GetSpendPeriodCalculationsDto } from '../stats/get-spend-period-calculations.dto'
import { NetworkPlanckValue, Nil } from '../utils/types'
import { BlockchainConfig, BlockchainConfigToken } from './blockchain-configuration/blockchain-configuration.config'
import { BlockchainTimeLeft } from './dto/blockchain-time-left.dto'
import { MotionTimeDto, MotionTimeType } from './dto/motion-time.dto'
import { DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { encodeAddress } from '@polkadot/keyring'

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

    async healthCheck(): Promise<ServiceStatus[]> {
        const services: ServiceStatus[] = []
        for (const conf of this.blockchainsConfiguration) {
            const api = getApi(this.blockchainsConnections, conf.id)
            try {
                await api.isReadyOrError
                await Promise.all([
                    api.derive.chain.bestNumber(),
                    api.derive.treasury.proposals(),
                    api.derive.bounties.bounties(),
                ])
                services.push(new ServiceStatus(conf.id, 'up'))
            } catch (e) {
                logger.info(`blockchain ${conf.id} healthCheck error:`, e)
                services.push(new ServiceStatus(conf.id, 'down'))
            }
        }
        return services
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
    ): MotionTimeDto {
        return new MotionTimeDto({
            type: MotionTimeType.Future,
            blockNo: futureBlockNumber.toNumber(),
            ...this.getTime(networkId, currentBlockNumber, futureBlockNumber),
        })
    }

    getPastTime(networkId: string, currentBlockNumber: BlockNumber, pastBlockNumber: BlockNumber | BN): MotionTimeDto {
        return {
            type: MotionTimeType.Past,
            blockNo: pastBlockNumber.toNumber(),
            ...this.getTime(networkId, pastBlockNumber, currentBlockNumber),
        }
    }

    getTime(
        networkId: string,
        firstBlockNumber: BlockNumber | BN,
        secondBlockNumber: BlockNumber | BN,
    ): Omit<MotionTimeDto, 'type' | 'blockNo'> {
        const remainingBlocks = secondBlockNumber.sub(firstBlockNumber)
        const timeLeft = this.blocksToTime(networkId, remainingBlocks)
        return {
            blocksCount: remainingBlocks.toNumber(),
            time: timeLeft,
        }
    }

    async getDeriveProposals(networkId: string) {
        const api = getApi(this.blockchainsConnections, networkId)
        const { proposals: proposedProposals, approvals: approvedProposals } = await api.derive.treasury.proposals()
        return [
            ...proposedProposals.map((proposal: DeriveTreasuryProposal) => ({
                ...proposal,
                status: BlockchainProposalStatus.Proposal,
            })),
            ...approvedProposals.map((proposal: DeriveTreasuryProposal) => ({
                ...proposal,
                status: BlockchainProposalStatus.Approval,
            })),
        ]
    }

    async getDeriveProposal(networkId: string, blockchainIndex: number) {
        const proposals = await this.getDeriveProposals(networkId)
        return proposals.find((proposal) => proposal.id.toNumber() === blockchainIndex)
    }

    async getProposal(networkId: string, blockchainIndex: number): Promise<Nil<BlockchainProposal>> {
        logger.info(`Getting proposal from blockchain for networkId: ${networkId}`)
        const blockchainProposal = await this.getDeriveProposal(networkId, blockchainIndex)
        if (!blockchainProposal) return
        const currentBlockNumber = await this.getCurrentBlockNumber(networkId)
        const toBlockchainProposalMotionEnd = (endBlock: BlockNumber): MotionTimeDto =>
            this.getRemainingTime(networkId, currentBlockNumber, endBlock)
        return BlockchainProposal.create(blockchainProposal, blockchainProposal.status, toBlockchainProposalMotionEnd)
    }

    async getProposals(networkId: string): Promise<BlockchainProposal[]> {
        logger.info(`Getting proposals from blockchain for networkId: ${networkId}`)
        const api = getApi(this.blockchainsConnections, networkId)

        const blockchainProposals = await this.getDeriveProposals(networkId)

        const proposalCountNumber = blockchainProposals.length
        logger.info(`ProposalCount is ${proposalCountNumber}.`)
        if (proposalCountNumber === 0) {
            return []
        }

        // make a function that will compute remaining voting time
        const currentBlockNumber = await api.derive.chain.bestNumber()
        const toBlockchainProposalMotionEnd = (endBlock: BlockNumber): MotionTimeDto =>
            this.getRemainingTime(networkId, currentBlockNumber, endBlock)
        return blockchainProposals.map((deriveProposal) =>
            BlockchainProposal.create(deriveProposal, deriveProposal.status, toBlockchainProposalMotionEnd),
        )
    }

    extractProposalIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a blockchain proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'treasury', 'Proposed', 0)
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

    async getCurrentBlockNumber(networkId: string) {
        const api = getApi(this.blockchainsConnections, networkId)
        return api.derive.chain.bestNumber() // current block number
    }

    encodeAddress(networkId: string, address: string): string {
        const blockchainConfiguration = getBlockchainConfiguration(this.blockchainsConfiguration, networkId)
        return encodeAddress(address, blockchainConfiguration.ss58Format)
    }
}
