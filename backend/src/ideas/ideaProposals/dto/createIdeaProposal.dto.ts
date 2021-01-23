import {ApiProperty} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {Allow, IsNumber, ValidateNested} from "class-validator";

export class IdeaProposalDataDto {
    @ApiProperty({description: 'The current next proposal id', required: true})
    @IsNumber()
    nextProposalId: number

    constructor(nextProposalId: number) {
        this.nextProposalId = nextProposalId
    }
}

export class CreateIdeaProposalDto {
    @ApiProperty({description: 'Idea network ID', required: true})
    @Allow()
    ideaNetworkId: string

    @ApiProperty({description: 'Hash of extrinsic which creates proposal', required: true})
    @Allow()
    extrinsicHash: string

    @ApiProperty({description: 'Hash of last seen block', required: true})
    @Allow()
    lastBlockHash: string

    @ApiProperty({description: 'Details of the proposal to be found', required: true})
    @ValidateNested()
    @Type(() => IdeaProposalDataDto)
    data: IdeaProposalDataDto

    constructor(ideaNetworkId: string, extrinsicHash: string, lastBlockHash: string, data: IdeaProposalDataDto) {
        this.ideaNetworkId = ideaNetworkId
        this.extrinsicHash = extrinsicHash
        this.lastBlockHash = lastBlockHash
        this.data = data
    }
}
