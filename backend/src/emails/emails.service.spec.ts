import {Test} from '@nestjs/testing';
import {beforeAllSetup} from "../utils/spec.helpers";
import {EmailsModule} from "./emails.module";
import {EmailsService} from './emails.service';

describe('EmailsService', () => {
    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [EmailsModule]
        }).compile()
    )

    const service = beforeAllSetup(() => module().get<EmailsService>(EmailsService))

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('send email', () => {
        it('should send email', async () => {
            // const result = await service().sendEmail()
            // expect(result).toBe(true)
        })
    })
});
