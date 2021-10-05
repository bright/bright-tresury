import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ReadAppEventDto {
    @ApiProperty({
        description: 'Ids of the app event',
    })
    @IsNotEmpty()
    appEventIds!: string[]
}
