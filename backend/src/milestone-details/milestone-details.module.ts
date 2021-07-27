import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from '../database/database.module'
import { MilestoneDetails } from './entities/milestone-details.entity'
import { MilestoneDetailsService } from './milestone-details.service'

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([MilestoneDetails])],
    providers: [MilestoneDetailsService],
    exports: [MilestoneDetailsService],
})
export class MilestoneDetailsModule {}
