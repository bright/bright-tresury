import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator'
import { UpdateIdeaMilestoneNetworkDto } from './update-idea-milestone-network.dto'

export class UpdateIdeaMilestoneNetworkItemDto extends UpdateIdeaMilestoneNetworkDto {
    @ApiProperty({
        description: 'Id of the idea milestone network to update',
    })
    @IsUUID('4')
    @IsNotEmpty()
    id!: string
}

export class UpdateIdeaMilestoneNetworksDto {
    @ApiProperty({
        description: 'Idea milestone networks to update',
        type: [UpdateIdeaMilestoneNetworkItemDto],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateIdeaMilestoneNetworkItemDto)
    items!: UpdateIdeaMilestoneNetworkItemDto[]
}
