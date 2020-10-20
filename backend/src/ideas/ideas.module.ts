import { Module } from '@nestjs/common';
import { IdeasController } from './ideas.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';
import { IdeasService } from './ideas.service';
import { IdeaNetwork } from './ideaNetwork.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Idea]), TypeOrmModule.forFeature([IdeaNetwork])],
  providers: [IdeasService],
  controllers: [IdeasController]
})
export class IdeasModule {}
