import {Module} from '@nestjs/common';
import {ConfigModule} from "../config/config";
import {EmailsService} from './emails.service';

@Module({
    imports: [ConfigModule],
    providers: [EmailsService],
    exports: [EmailsService],
})
export class EmailsModule {
}
