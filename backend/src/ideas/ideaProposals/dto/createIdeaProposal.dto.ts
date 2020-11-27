import { ApiModelProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";

export class IdeaProposalDataDto {
    @ApiModelProperty()
    @IsNumber()
    nextProposalId: number

    constructor(nextProposalId: number) {
        this.nextProposalId = nextProposalId
    }
}

export class CreateIdeaProposalDto {
    @ApiModelProperty()
    ideaNetworkId: string

    @ApiModelProperty()
    extrinsicHash: string

    @ApiModelProperty()
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

