import { ExtrinsicEntity, ExtrinsicStatuses } from '../extrinsic.entity'
import { Allow } from 'class-validator'

export class ExtrinsicDto {
    extrinsicHash: string
    lastBlockHash: string
    data: any
    @Allow()
    status: ExtrinsicStatuses

    constructor(extrinsicHash: string, lastBlockHash: string, data: string, status: ExtrinsicStatuses) {
        this.extrinsicHash = extrinsicHash
        this.lastBlockHash = lastBlockHash
        this.data = data
        this.status = status
    }
}

export function toExtrinsicDto(extrinsic: ExtrinsicEntity) {
    return new ExtrinsicDto(extrinsic.extrinsicHash, extrinsic.lastBlockHash, extrinsic.data, extrinsic.status)
}
