import {ApiProperty} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";

export class IdeaProposalDataDto {
    @ApiProperty()
    @IsNumber()
    nextProposalId: number

    constructor(nextProposalId: number) {
        this.nextProposalId = nextProposalId
    }
}

export class CreateIdeaProposalDto {
    @ApiProperty()
    ideaNetworkId: string

    @ApiProperty()
    extrinsicHash: string

    @ApiProperty()
    lastBlockHash: string

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

