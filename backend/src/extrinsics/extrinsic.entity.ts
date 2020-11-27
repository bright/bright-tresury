import { Column, Entity } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { ExtrinsicEvent } from "./extrinsicEvent";

export enum ExtrinsicStatuses {
    ExtrinsicSuccess= 'ExtrinsicSuccess',
    ExtrinsicFailed = 'ExtrinsicFailed',
    ExtrinsicNotSend = 'ExtrinsicNotSend',
}

@Entity("extrinsics")
export class Extrinsic extends BaseEntity {
    @Column({ nullable: false })
    extrinsicHash: string

    @Column({ nullable: false, type: "text" })
    lastBlockHash: string

    @Column({ nullable: false, type: "json", default: {} })
    data: any

    @Column({ nullable: false, type: "text" })
    status: ExtrinsicStatuses

    @Column({ nullable: true, type: "text" })
    blockHash?: string | null

    @Column({ nullable: true, type: "json", default: {} })
    events?: ExtrinsicEvent[] | null

    constructor(extrinsicHash: string, lastBlockHash: string, data?: any, status?: ExtrinsicStatuses) {
        super()
        this.extrinsicHash = extrinsicHash
        this.lastBlockHash = lastBlockHash
        this.data = data ?? {}
        this.status = status ?? ExtrinsicStatuses.ExtrinsicNotSend
    }
}
