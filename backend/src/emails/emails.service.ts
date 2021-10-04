import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { Inject, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import handlebars from 'handlebars'
import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import * as path from 'path'
import { AWSConfig, AWSConfigToken } from '../aws.config'
import { getLogger } from '../logging.module'
import { EmailsConfig, EmailsConfigToken } from './emails.config'
import { EmailTemplates } from './templates/templates'

const logger = getLogger()

@Injectable()
export class EmailsService {
    private nodemailerTransport: Mail
    private readonly sesClient: SESClient

    constructor(
        @Inject(EmailsConfigToken) private readonly emailsConfig: EmailsConfig,
        @Inject(AWSConfigToken) private readonly awsConfig: AWSConfig,
    ) {
        this.sesClient = new SESClient({ region: this.awsConfig.region })
        this.nodemailerTransport = createTransport({
            SES: {
                ses: this.sesClient,
                aws: { SendRawEmailCommand },
            },
        })
    }

    async sendVerifyEmail(to: string, verifyUrl: string) {
        logger.info(`Sending verify email to ${to}`)
        const templateData = {
            url: verifyUrl,
        }
        const subject = 'Welcome to BrightTreasury!'
        const text = `Please confirm your registration and login to Treasury app: ${verifyUrl}`
        const html = this.compileTemplate(EmailTemplates.VerifyEmailTemplate, templateData)
        return this.sendEmail(to, subject, text, html)
    }

    async sendEmailFromTemplate(to: string, subject: string, text: string, template: EmailTemplates, data: unknown) {
        const html = this.compileTemplate(template, data)
        return this.sendEmail(to, subject, text, html)
    }

    async sendEmail(to: string, subject: string, text: string, html: string) {
        logger.info(`Sending email to ${to} with subject ${subject}`)

        const params = {
            from: this.emailsConfig.emailAddress,
            to,
            subject,
            text,
            html,
        }

        try {
            const data = await this.nodemailerTransport.sendMail(params)
            logger.info('Email sent', data)
        } catch (err) {
            logger.error('Error sending email', err)
        }
        return
    }

    compileTemplate(name: EmailTemplates, data: unknown): string {
        try {
            const emailTemplateSource = this.getTemplateSource(name)
            if (!emailTemplateSource) {
                return ''
            }
            const template = handlebars.compile(emailTemplateSource)
            const html = template(data)
            return html
        } catch (err) {
            logger.error(`Error compiling template ${name} with data ${JSON.stringify(data)}`, err)
            return ''
        }
    }

    private getTemplateSource(name: EmailTemplates) {
        const baseTemplateFile = path.join(__dirname, '/../emails/templates/', `${name}.hbs`)
        const fallbackTemplateFile = path.join(__dirname, '/../../emails/templates/', `${name}.hbs`)

        const templateFile = fs.existsSync(baseTemplateFile)
            ? baseTemplateFile
            : fs.existsSync(fallbackTemplateFile)
            ? fallbackTemplateFile
            : undefined

        if (!templateFile) {
            logger.error(`Error compiling template ${templateFile} - template file not found.`)
            return undefined
        }
        return fs.readFileSync(templateFile, 'utf8')
    }
}
