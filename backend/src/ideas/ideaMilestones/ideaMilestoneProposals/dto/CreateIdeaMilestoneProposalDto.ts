import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateIdeaMilestoneProposalDto {
    @ApiProperty({description: 'Id of idea milestone network', required: true})
    @IsNotEmpty()
    ideaMilestoneNetworkId: string

    @ApiProperty({description: 'Hash of extrinsic which creates proposal', required: true})
    @IsNotEmpty()
    extrinsicHash: string

    @ApiProperty({description: 'Hash of last seen block', required: true})
    @IsNotEmpty()
    lastBlockHash: string

    constructor(ideaMilestoneNetworkId: string, extrinsicHash: string, lastBlockHash: string) {
        this.ideaMilestoneNetworkId = ideaMilestoneNetworkId
        this.extrinsicHash = extrinsicHash
        this.lastBlockHash = lastBlockHash
    }
}
