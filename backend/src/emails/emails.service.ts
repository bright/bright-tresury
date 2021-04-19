import {SESClient, SendRawEmailCommand} from '@aws-sdk/client-ses';
import {Inject, Injectable} from '@nestjs/common';
import Mail from "nodemailer/lib/mailer";
import {AWSConfig, AWSConfigToken} from "../aws.config";
import {getLogger} from "../logging.module";
import {EmailsConfig, EmailsConfigToken} from "./emails.config";
import { createTransport } from 'nodemailer';

const logger = getLogger()

enum Templates {
    VerifyEmail = "TreasuryVerifyEmail"
}

@Injectable()
export class EmailsService {
    private nodemailerTransport: Mail;
    private sesClient: SESClient;

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
        const templateData = {
            url: verifyUrl
        }
        return this.sendEmail(to, Templates.VerifyEmail, templateData)
    }

    async sendEmail(to: string, templateName: string, templateData: any) {
        const stringifiedData = JSON.stringify(templateData)

        logger.info(`Sending email to ${to} with template ${templateName} and data ${stringifiedData}`)

        const params = {
            from: this.emailsConfig.emailAddress,
            to,
            subject: 'Message',
            text: 'I hope this message gets sent!',
            ses: {
                // optional extra arguments for SendRawEmail
                Tags: [
                    {
                        Name: 'tag_name',
                        Value: 'tag_value'
                    }
                ]
            }
            // Destination: {
            //     CcAddresses: [],
            //     ToAddresses: [to],
            // },
            // Source: this.emailsConfig.emailAddress,
            // Template: templateName,
            // TemplateData: stringifiedData,
            // ReplyToAddresses: [],
        };

        // const sesClient = new SESClient({region: this.awsConfig.region});
        try {
            // const data = await sesClient.send(new SendTemplatedEmailCommand(params));
            const data = await this.nodemailerTransport.sendMail(params)
            logger.info("Email sent", data)
        } catch (err) {
            logger.error("Error sending email", err)
        } finally {
            // sesClient.destroy()
        }
        return
    }

}
