import {Test} from '@nestjs/testing';
import {AppModule} from "../app.module";
import {ConfigModule} from "../config/config";
import {beforeAllSetup} from "../utils/spec.helpers";
import {EmailsModule} from "./emails.module";
import {EmailsService} from './emails.service';

describe('EmailsService', () => {
    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [AppModule]
        }).compile()
    )

    const service = beforeAllSetup(() => module().get<EmailsService>(EmailsService))

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /*
    These tests are ignored by default, as we do not want to send an email on every run of tests.
    Enable them to check if sending emails works fine after any changes.
    Remember to set your email address as the the receiver mail.
     */
    describe.skip('send email', () => {
        it.skip('should send email', async () => {
            await service().sendEmail('agnieszka.olszewska@brightinventions.pl', 'xx', {})
        })
    })

});
