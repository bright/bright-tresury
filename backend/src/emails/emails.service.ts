import {SendRawEmailCommand, SESClient} from '@aws-sdk/client-ses';
import {Inject, Injectable} from '@nestjs/common';
import * as fs from "fs";
import handlebars from 'handlebars';
import {createTransport} from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import * as path from "path";
import {AWSConfig, AWSConfigToken} from "../aws.config";
import {getLogger} from "../logging.module";
import {EmailsConfig, EmailsConfigToken} from "./emails.config";

const logger = getLogger()

@Injectable()
export class EmailsService {
    private nodemailerTransport: Mail
    private readonly sesClient: SESClient

    constructor(
        @Inject(EmailsConfigToken) private readonly emailsConfig: EmailsConfig,
        @Inject(AWSConfigToken) private readonly awsConfig: AWSConfig,
    ) {
        this.sesClient = new SESClient({region: this.awsConfig.region})
        this.nodemailerTransport = createTransport({
            SES: {
                ses: this.sesClient,
                aws: {SendRawEmailCommand}
            }
        });
    }

    async sendVerifyEmail(to: string, verifyUrl: string) {
        logger.info(`Sending verify email to ${to}`)
        const templateData = {
            url: verifyUrl
        }
        const subject = 'Welcome to BrightTreasury!'
        const text = `Please confirm your registration and login to Treasury app: ${verifyUrl}`
        const html = this.compileTemplate('verifyEmailTemplate', templateData)
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
        };

        try {
            const data = await this.nodemailerTransport.sendMail(params)
            logger.info("Email sent", data)
        } catch (err) {
            logger.error("Error sending email", err)
        }
        return
    }

    compileTemplate(name: string, data: any): string {
        try {
            const emailTemplateSource = this.getTemplateSource(name)
            if (!emailTemplateSource) {
                logger.error(`Error compiling template ${name}. Template not found`)
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

    private getTemplateSource(name: string) {
        const baseTemplatesDir = path.join(__dirname, "/../emails/templates/")
        const fallbackTemplatesDir = path.join(__dirname, "/../../emails/templates/")
        const templatesDir = fs.existsSync(baseTemplatesDir) ? baseTemplatesDir : (fs.existsSync(fallbackTemplatesDir) ? fallbackTemplatesDir : undefined)
        if (!templatesDir) {
            return undefined
        }
        const templateFile = path.join(templatesDir, `${name}.hbs`)
        if (!fs.existsSync(templateFile)) {
            return undefined
        }
        return fs.readFileSync(templateFile, "utf8")
    }

}
