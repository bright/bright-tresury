import { Test } from '@nestjs/testing'
import { AppModule } from '../app.module'
import { beforeAllSetup } from '../utils/spec.helpers'
import { EmailsService } from './emails.service'

describe('EmailsService', () => {
    const module = beforeAllSetup(
        async () =>
            await Test.createTestingModule({
                imports: [AppModule],
            }).compile(),
    )

    const service = beforeAllSetup(() => module().get<EmailsService>(EmailsService))

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    /*
        These tests are skipped by default, as we do not want to send an email on every run of tests.
        Enable them to check if sending emails works fine after any changes.
        Remember to set your email address as the the receiver mail.
         */
    describe('send email', () => {
        it.skip('should send email', async () => {
            await service().sendEmail(
                'agnieszka.olszewska@brightinventions.pl',
                'subject',
                'text',
                '<html><p>Some text</p></html>',
            )
        })
        it.skip('should send verify email', async () => {
            await service().sendVerifyEmail('agnieszka.olszewska@brightinventions.pl', 'verify url')
        })
    })

    describe('compile template', () => {
        it('should read template and replace params', async () => {
            const actual = await service().compileTemplate('testTemplate', { param: 'value' })
            const expected = '<html>Test template with a value</html>\n'
            expect(actual).toBe(expected)
        })
    })
})
