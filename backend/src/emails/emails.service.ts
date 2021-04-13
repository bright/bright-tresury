import {SendTemplatedEmailCommand, SESClient} from '@aws-sdk/client-ses';
import {Inject, Injectable} from '@nestjs/common';
import {AWSConfig, AWSConfigToken} from "../aws.config";
import {getLogger} from "../logging.module";
import {EmailsConfig, EmailsConfigToken} from "./emails.config";

const logger = getLogger()

enum Templates {
    VerifyEmail = "TreasuryVerifyEmail"
}

@Injectable()
export class EmailsService {

    constructor(
        @Inject(EmailsConfigToken) private readonly emailsConfig: EmailsConfig,
        @Inject(AWSConfigToken) private readonly awsConfig: AWSConfig,
    ) {
    }

    async sendVerifyEmail(to: string, verifyUrl: string) {
        const templateData = {
            url: verifyUrl
        }
        return this.sendEmail(to, Templates.VerifyEmail, templateData)
    }

    private async sendEmail(to: string, templateName: string, templateData: any) {
        const stringifiedData = JSON.stringify(templateData)

        logger.info(`Sending email to ${to} with template ${templateName} and data ${stringifiedData}`)

        const params = {
            Destination: {
                CcAddresses: [],
                ToAddresses: [to],
            },
            Source: this.emailsConfig.emailAddress,
            Template: templateName,
            TemplateData: stringifiedData,
            ReplyToAddresses: [],
        };

        const sesClient = new SESClient({region: this.awsConfig.region});
        try {
            const data = await sesClient.send(new SendTemplatedEmailCommand(params));
            logger.info("Email sent", data)
        } catch (err) {
            logger.error("Error sending email", err)
        } finally {
            sesClient.destroy()
        }
        return
    }

}
