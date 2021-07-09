import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from '../database/database.module'
import { IdeaProposalDetail } from './idea-proposal-detail.entity'
import { IdeaProposalDetailsService } from './idea-proposal-details.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([IdeaProposalDetail])],
    providers: [IdeaProposalDetailsService],
    exports: [IdeaProposalDetailsService],
})
export class IdeaProposalDetailsModule {}
