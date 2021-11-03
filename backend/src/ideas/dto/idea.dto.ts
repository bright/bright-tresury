import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { IdeaEntity } from '../entities/idea.entity'
import { IdeaMilestoneDto } from '../idea-milestones/dto/idea-milestone.dto'
import { IdeaStatus } from '../entities/idea-status'
import { IdeaNetworkDto } from './idea-network.dto'

export class IdeaDto {
    @ApiProperty({
        description: 'Id of the idea',
    })
    id!: string

    @ApiPropertyOptional({
        description: 'Blockchain address of the idea beneficiary',
    })
    beneficiary?: string

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
        description: 'Id of the user owning the idea',
        type: [IdeaMilestoneDto],
    })
    ownerId: string

    @ApiProperty({
        description: 'Details of the idea',
        type: [IdeaProposalDetailsDto],
    })
    details: IdeaProposalDetailsDto

    constructor({ id, status, networks, ordinalNumber, ownerId, beneficiary, details }: IdeaEntity) {
        this.id = id
        this.status = status
        this.networks = networks ? networks.map((ideaNetwork) => new IdeaNetworkDto(ideaNetwork)) : []
        this.ordinalNumber = ordinalNumber
        this.ownerId = ownerId
        this.beneficiary = beneficiary
        this.details = new IdeaProposalDetailsDto(details)
    }
}
