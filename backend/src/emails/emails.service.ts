import {ListIdentitiesCommand, SendTemplatedEmailCommand, SESClient, VerifyEmailIdentityCommand} from '@aws-sdk/client-ses';
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

    // TODO: run on each deploy using cli or find other solution
    async initializeEmail() {
        const REGION = "eu-central-1"
        const params = {
            IdentityType: "EmailAddress",
            MaxItems: 0,
        };

        const newEmailParams = {EmailAddress: 'agnieszka.olszewska@brightinventions.pl'};

        const ses = new SESClient({region: REGION});
        try {
            const data = await ses.send(new ListIdentitiesCommand(params));
            if (!data.Identities?.includes(newEmailParams.EmailAddress)) {
                const data1 = await ses.send(new VerifyEmailIdentityCommand(newEmailParams));
                console.log(data1)
            }
            console.log("Success.", data);
        } catch (err) {
            console.error(err, err.stack);
        }
        return
    }

    async sendVerifyEmail(to: string, verifyUrl: string) {
        const templateData = {
            url: verifyUrl
        }
        // TODO check if the template exists
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

        const ses = new SESClient({region: this.awsConfig.region});
        try {
            const data = await ses.send(new SendTemplatedEmailCommand(params));
            logger.info("Email sent", data)
        } catch (err) {
            logger.error("Error sending email", err)
        }
        return
    }
}
