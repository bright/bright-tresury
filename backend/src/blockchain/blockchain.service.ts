import {Inject, Injectable, OnModuleDestroy} from '@nestjs/common'
import {ApiPromise} from '@polkadot/api'
import Extrinsic from "@polkadot/types/extrinsic/Extrinsic";
import {EventRecord, Header} from '@polkadot/types/interfaces';
import {extractTime} from '@polkadot/util';
import {UpdateExtrinsicDto} from "../extrinsics/dto/updateExtrinsic.dto";
import {ExtrinsicEvent} from "../extrinsics/extrinsicEvent";
import {getLogger} from "../logging.module";
import {BlockchainProposal, BlockchainProposalStatus, toBlockchainProposal} from "./dto/blockchainProposal.dto";
import {DeriveAccountRegistration} from "@polkadot/api-derive/accounts/types";
import type { BlockNumber } from '@polkadot/types/interfaces/runtime';
import {getProposers, getBeneficiaries, getVoters} from './utils'

const logger = getLogger()

@Injectable()
export class BlockchainService implements OnModuleDestroy {
    private unsub?: () => void;

    constructor(
        @Inject('PolkadotApi') private readonly polkadotApi: ApiPromise,
    ) {
    }

    async getApi(): Promise<ApiPromise> {
        return this.polkadotApi
    }

    async onModuleDestroy() {
        await this.callUnsub()
    }

    async callUnsub() {
        await this.unsub?.()
        this.unsub = undefined
    }

    async listenForExtrinsic(
        extrinsicHash: string,
        cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>) {

        let blocksCount = 0;

        this.unsub = await this.polkadotApi.rpc.chain.subscribeFinalizedHeads(async (header: Header) => {
            blocksCount++
            const signedBlock = await this.polkadotApi.rpc.chain.getBlock(header.hash);
            // TODO fix types!
            // @ts-ignore
            const extrinsic: Extrinsic | undefined = signedBlock.block.extrinsics.find((ex) => ex.hash.toString() === extrinsicHash)
            if (extrinsic) {
                const events = ((await this.polkadotApi.query.system.events.at(header.hash)) as unknown) as EventRecord[];
                await this.callUnsub()

                const applyExtrinsicEvents = events
                    .filter(({phase, event}) => phase.isApplyExtrinsic)
                    .map(({event}) => {
                        const types = event.typeDef;
                        return {
                            section: event.section,
                            method: event.method,
                            data: event.data.map((value, index) => {
                                return {
                                    name: types[index].type,
                                    value: value.toString()
                                }
                            })
                        } as ExtrinsicEvent
                    })

                const method = extrinsic.method.toJSON() as { args?: unknown }
                const args = method?.args ?? {}

                const result = {
                    blockHash: header.hash.toString(),
                    events: applyExtrinsicEvents,
                    data: args
                } as UpdateExtrinsicDto

                await cb(result)
            }

            // stop listening to blocks after some time - we assume the block might not be found
            // TODO set the threshold to some reasonable value
            if (blocksCount >= 50) {
                await this.callUnsub()
            }
        })
    }

    async getIdentities(addresses: string[]): Promise<Map<string, DeriveAccountRegistration>> {
        logger.info('Getting identities from blockchain')
        const identities = new Map<string, DeriveAccountRegistration>()
        for (const address of addresses) {
            identities.set(address, await this.polkadotApi.derive.accounts.identity(address))
        }
        return identities;
    }

    getRemainingTime(currentBlockNumber: BlockNumber , futureBlockNumber: BlockNumber | undefined) {
        if (!futureBlockNumber) {
            return {}
        }
        const DEFAULT_TIME = 6000
        const {babe, difficulty, timestamp} = this.polkadotApi.consts;
        const blockTime = babe?.expectedBlockTime || difficulty?.targetBlockTime || timestamp?.minimumPeriod.muln(2) || DEFAULT_TIME
        const remainingBlocks = futureBlockNumber.sub(currentBlockNumber);
        const remainingMilliseconds = blockTime.mul(remainingBlocks).toNumber();
        const timeLeft = extractTime(Math.abs(remainingMilliseconds));
        return { endBlock: futureBlockNumber.toNumber(), remainingBlocks: remainingBlocks.toNumber(), timeLeft }
    }

    async getProposals(): Promise<BlockchainProposal[]> {
        logger.info('Getting proposals from blockchain...')
        const {proposals, proposalCount, approvals} = await this.polkadotApi.derive.treasury.proposals()

        const proposalCountNumber = proposalCount.toNumber()
        logger.info(`ProposalCount is ${proposalCountNumber}.`)
        if (proposalCountNumber === 0) {
            return []
        }

        logger.info('Getting voters');

        // get unique (set) accountIds as strings (toHuman) from ongoing proposals and approvals
        const addresses = new Set([
            ...getProposers(proposals), ...getProposers(approvals),
            ...getBeneficiaries(proposals), ...getBeneficiaries(approvals),
            ...getVoters(proposals), ...getVoters(approvals)
        ].map((accountId) => accountId.toHuman()));
        const identities = await this.getIdentities(Array.from(addresses));

        // make a function that will compute remaining voting time
        const currentBlockNumber = await this.polkadotApi.derive.chain.bestNumber();
        const calcRemainingTime = (endBlock: BlockNumber | undefined) => this.getRemainingTime(currentBlockNumber, endBlock);

        return [
            ...proposals.map((derivedProposal) => toBlockchainProposal(derivedProposal, BlockchainProposalStatus.Proposal, identities, calcRemainingTime)),
            ...approvals.map((derivedProposal) => toBlockchainProposal(derivedProposal, BlockchainProposalStatus.Approval, identities, calcRemainingTime))
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
