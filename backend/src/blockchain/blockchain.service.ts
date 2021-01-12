import {HttpException, Inject, Injectable} from '@nestjs/common'
import {ApiPromise} from '@polkadot/api'
import Extrinsic from "@polkadot/types/extrinsic/Extrinsic";
import {EventRecord, Header} from '@polkadot/types/interfaces';
import {UpdateExtrinsicDto} from "../extrinsics/dto/updateExtrinsic.dto";
import {ExtrinsicEvent} from "../extrinsics/extrinsicEvent";
import {getLogger} from "../logging.module";
import {BlockchainProposal} from "./dot/blockchainProposal.dto";
import BN from 'bn.js';

const logger = getLogger()

@Injectable()
export class BlockchainService {
    private unsub?: () => void;

    constructor(
        @Inject('PolkadotApi') private readonly polkadotApi: ApiPromise,
    ) {
    }

    async getApi(): Promise<ApiPromise> {
        await this.polkadotApi.isReady
        return this.polkadotApi
    }

    async onModuleDestroy() {
        await this.unsub?.()
    }

    async listenForExtrinsic(
        extrinsicHash: string,
        cb: (updateExtrinsicDto: UpdateExtrinsicDto) => void) {

        try {
            await this.polkadotApi.isReadyOrError
        } catch (err) {
            throw new HttpException('No blockchain connection', 404)
        }

        let blocksCount = 0;

        this.unsub = await this.polkadotApi.rpc.chain.subscribeFinalizedHeads(async (header: Header) => {
            blocksCount++
            const signedBlock = await this.polkadotApi.rpc.chain.getBlock(header.hash);
            // TODO fix types!
            // @ts-ignore
            const extrinsic: Extrinsic | undefined = signedBlock.block.extrinsics.find((ex) => ex.hash.toString() === extrinsicHash)
            if (extrinsic) {
                const events = ((await this.polkadotApi.query.system.events.at(header.hash)) as unknown) as EventRecord[];
                await this.unsub?.()

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

                const result = {
                    blockHash: header.hash.toString(),
                    events: applyExtrinsicEvents
                } as UpdateExtrinsicDto

                cb(result)
            }

            // stop listening to blocks after some time - we assume the block might not be found
            // TODO set the threshold to some reasonable value
            if (blocksCount >= 50) {
                await this.unsub?.()
            }
        })
    }

    async getProposals(): Promise<BlockchainProposal[]> {
        logger.info('Getting proposals from blockchain...')

        const proposalCount = (await this.polkadotApi.query.treasury.proposalCount()).toNumber()
        logger.info(`ProposalCount is ${proposalCount}.`)

        if (proposalCount === 0) {
            return []
        } else {
            const result: BlockchainProposal[] = []
            for (let index = 0; index < proposalCount; index++) {
                const proposalOption = await this.polkadotApi.query.treasury.proposals(index)
                const proposal: any = proposalOption.isSome ? proposalOption.value.toJSON() : undefined
                if (proposal) {
                    result.push({
                        proposalIndex: index,
                        proposer: proposal.proposer,
                        beneficiary: proposal.beneficiary,
                        value: new BN(proposal.value),
                        bond: new BN(proposal.bond),
                    })
                }
            }
            logger.info(`Returning ${result.length} proposals.`)
            return result
        }
    }

}
