import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from '../database/database.module'
import { IdeaProposalDetails } from './idea-proposal-details.entity'
import { IdeaProposalDetailsService } from './idea-proposal-details.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([IdeaProposalDetails])],
    providers: [IdeaProposalDetailsService],
    exports: [IdeaProposalDetailsService],
})
export class IdeaProposalDetailsModule {}
