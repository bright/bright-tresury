import { Inject, Injectable } from '@nestjs/common'
import { ApiPromise } from '@polkadot/api'
import Extrinsic from "@polkadot/types/extrinsic/Extrinsic";
import { EventRecord, Header } from '@polkadot/types/interfaces';
import { UpdateExtrinsicDto } from "../extrinsics/dto/updateExtrinsic.dto";
import { ExtrinsicEvent } from "../extrinsics/extrinsicEvent";

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

        await this.polkadotApi.isReady

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
                    .filter(({ phase, event }) => phase.isApplyExtrinsic)
                    .map(({ event }) => {
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
}
