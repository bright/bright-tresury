import {Controller, Get, Param, Query} from '@nestjs/common';
import {ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags} from "@nestjs/swagger";
import {IsNotEmpty, IsNumberString} from "class-validator";
import {ProposalDto} from './dto/proposal.dto';
import {ProposalsService} from "./proposals.service";
import { ExtendedBlockchainProposal } from '../blockchain/dto/blockchainProposal.dto'

class GetProposalsQuery {
    @ApiProperty({
        description: 'Network name'
    })
    @IsNotEmpty()
    network!: string
}

// class GetProposalParams {
//     @ApiProperty({
//         description: 'Proposal index'
//     })
//     @IsNumberString()
//     @IsNotEmpty()
//     id!: string;
// }

@Controller('/v1/proposals')
@ApiTags('proposals')
export class ProposalsController {

    constructor(
        private proposalsService: ProposalsService
    ) {
    }

    @Get()
    @ApiOkResponse({
        description: 'Respond with proposals for the given network',
        type: [ProposalDto],
    })
    async getProposals(@Query() { network }: GetProposalsQuery): Promise<ProposalDto[]> {
        const proposals = await this.proposalsService.find(network)
        return proposals.map((proposal: ExtendedBlockchainProposal) => new ProposalDto(proposal))
    }

    // @Get(':id')
    // @ApiOkResponse({
    //     description: 'Respond with a proposal for selected id in selected network.',
    //     type: ProposalDto,
    // })
    // @ApiNotFoundResponse({description: 'Proposal not found.'})
    // async getProposal(@Param() params: GetProposalParams, @Query() query: GetProposalsQuery): Promise<ProposalDto> {
    //     const [proposal, idea] = await this.proposalsService.findOne(Number(params.id), query.network)
    //     return new ProposalDto(proposal, idea)
    // }
}
