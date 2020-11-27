import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';

@Module({
    controllers: [ProposalsController],
    providers: [ProposalsService]
})
export class ProposalsModule {
}
