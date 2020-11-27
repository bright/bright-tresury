import { ExtrinsicEvent } from "../extrinsicEvent";

export interface UpdateExtrinsicDto {
    blockHash: string
    events: ExtrinsicEvent[]
}
