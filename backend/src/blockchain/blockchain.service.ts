import {Inject, Injectable, OnModuleDestroy} from '@nestjs/common'
import {ApiPromise} from '@polkadot/api'
import {DeriveTreasuryProposals} from "@polkadot/api-derive/types";
import Extrinsic from "@polkadot/types/extrinsic/Extrinsic";
import {EventRecord, Header} from '@polkadot/types/interfaces';
import {UpdateExtrinsicDto} from "../extrinsics/dto/updateExtrinsic.dto";
import {ExtrinsicEvent} from "../extrinsics/extrinsicEvent";
import {getLogger} from "../logging.module";
import {BlockchainProposal, BlockchainProposalStatus, toBlockchainProposal} from "./dto/blockchainProposal.dto";

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

    async getProposals(): Promise<BlockchainProposal[]> {
        logger.info('Getting proposals from web3...')
        const proposals: DeriveTreasuryProposals = await this.polkadotApi.derive.treasury.proposals()

        const proposalCount = proposals.proposalCount.toNumber()
        logger.info(`ProposalCount is ${proposalCount}.`)

        if (proposalCount === 0) {
            return []
        }

        // TODO: It's also possible to extract voting results from DeriveTreasuryProposals object
        const result: BlockchainProposal[] = proposals.proposals.map((derivedProposal) => {
            return toBlockchainProposal(derivedProposal, BlockchainProposalStatus.Proposal)
        })

        return result.concat(proposals.approvals.map((derivedProposal) => {
            return toBlockchainProposal(derivedProposal, BlockchainProposalStatus.Approval)
        }))
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
