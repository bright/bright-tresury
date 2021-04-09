import {ListIdentitiesCommand, SendEmailCommand, SESClient, VerifyEmailIdentityCommand} from '@aws-sdk/client-ses';
import {Inject, Injectable} from '@nestjs/common';
import {AWSConfig, AWSConfigToken} from "../aws.config";
import {EmailsConfig, EmailsConfigToken} from "./emails.config";

@Injectable()
export class EmailsService {

    constructor(
        @Inject(EmailsConfigToken) private readonly emailsConfig: EmailsConfig,
        @Inject(AWSConfigToken) private readonly awsConfig: AWSConfig,
    ) {
    }

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

    async sendEmail(to: string, subject: string, htmlData: string, textData: string) {
        const REGION = this.awsConfig.region
        const charset = "UTF-8"
        const params = {
            Destination: {
                CcAddresses: [],
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: charset,
                        Data: textData,
                    },
                    Text: {
                        Charset: charset,
                        Data: htmlData,
                    },
                },
                Subject: {
                    Charset: charset,
                    Data: subject,
                },
            },
            Source: this.emailsConfig.emailAddress,
            ReplyToAddresses: [],
        };

        const ses = new SESClient({region: REGION});

        try {
            const data = await ses.send(new SendEmailCommand(params));
            console.log("Success", data);
        } catch (err) {
            console.log("Error", err);
        }
        return
    }
}
