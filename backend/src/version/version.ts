import { Controller, Get, Injectable, Module, Query } from '@nestjs/common';
import { Type } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";
import { UseAuth } from "../auth/auth.guard";
import { getLogger } from "../logging.module";
import { ApiOkResponse, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

const logger = getLogger()

@Injectable()
export class VersionService {
    readonly gitSha: string = 'aaabbbccc'
}

class GetVersionResponse {
    @ApiProperty({})
    version: string

    constructor(version: string) {
        this.version = version;
    }
}

class GetVersionQuery {
    @ApiPropertyOptional({
        default: 8,
    })
    @IsNumber()
    length: number = 8

    @ApiProperty({
        default: false
    })
    @IsBoolean()
    @Type(() => Boolean)
    upperCase!: boolean
}

@Controller("/api/v1")
@UseAuth()
export class VersionController {
    constructor(private readonly versionService: VersionService) {
    }

    @Get("/version")
    @ApiOkResponse({
        type: GetVersionResponse
    })
    async version(@Query() getVersionQuery: GetVersionQuery): Promise<GetVersionResponse> {
        logger.info("Using", this.versionService, " to get git sha", getVersionQuery)
        return { version: this.versionService.gitSha }
    }
}

@Module({
    imports: [],
    controllers: [VersionController],
    providers: [VersionService]
})
export class VersionModule {
}
