import {ApiProperty} from "@nestjs/swagger";
import {IdeaMilestoneNetwork} from "../entities/idea.milestone.network.entity";
import {IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID} from "class-validator";

export class IdeaMilestoneNetworkDto {
    @ApiProperty({
        description: 'Id from the database'
    })
    @IsOptional()
    @IsUUID('4')
    id?: string

    @ApiProperty({
        description: 'Name of the network'
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        description: 'Value of the network'
    })
    @IsNotEmpty()
    @IsNumber()
    value: number

    constructor(name: string, value: number, id?: string) {
        this.id = id
        this.name = name
        this.value = Number(value)
    }
}

export const mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto = (
    { id, name, value  }: IdeaMilestoneNetwork
): IdeaMilestoneNetworkDto => {
    return new IdeaMilestoneNetworkDto(name, value, id)
}
