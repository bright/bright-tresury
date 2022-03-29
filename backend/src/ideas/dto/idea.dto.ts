import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { IdeaMilestoneDto } from '../idea-milestones/dto/idea-milestone.dto'
import { IdeaStatus } from '../entities/idea-status'
import { IdeaNetworkDto } from './idea-network.dto'
import { PublicUserDto } from '../../users/dto/public-user.dto'
import FindIdeaDto from './find-idea.dto'
import { Nil } from '../../utils/types'

export class IdeaDto {
    @ApiProperty({
        description: 'Id of the idea',
    })
    id!: string

    @ApiProperty({ description: 'Information about idea owner', type: PublicUserDto })
    owner: PublicUserDto

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea beneficiary',
        type: PublicUserDto,
    })
    beneficiary?: Nil<PublicUserDto>

    @ApiProperty({
        description: 'Networks of the idea',
        type: [IdeaNetworkDto],
    })
    networks!: IdeaNetworkDto[]

    @ApiProperty({
        description: 'Ordinal number of the idea',
    })
    ordinalNumber: number

    @ApiProperty({
        description: 'Status of the idea',
        enum: IdeaStatus,
    })
    status: IdeaStatus

    @ApiProperty({
        description: 'Milestones of the idea',
        type: [IdeaMilestoneDto],
    })
    milestones!: IdeaMilestoneDto[]

    @ApiProperty({
        description: 'Details of the idea',
        type: [IdeaProposalDetailsDto],
    })
    details: IdeaProposalDetailsDto


    constructor({ entity: { id, status, networks, ordinalNumber, owner, details }, beneficiary }: FindIdeaDto) {
        this.id = id
        this.status = status
        this.networks = networks ? networks.map((ideaNetwork) => new IdeaNetworkDto(ideaNetwork)) : []
        this.ordinalNumber = ordinalNumber
        this.owner = PublicUserDto.fromUserEntity(owner)
        this.beneficiary = beneficiary
        this.details = new IdeaProposalDetailsDto(details)
    }
}
