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

});
