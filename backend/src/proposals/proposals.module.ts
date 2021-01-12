import {Module} from '@nestjs/common';
import {BlockchainModule} from "../blockchain/blockchain.module";
import {DatabaseModule} from "../database/database.module";
import {ProposalsController} from './proposals.controller';
import {ProposalsService} from './proposals.service';

@Module({
    imports: [DatabaseModule, BlockchainModule],
    controllers: [ProposalsController],
    providers: [ProposalsService],
})
export class ProposalsModule {
}
