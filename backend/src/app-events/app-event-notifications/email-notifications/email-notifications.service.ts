import { Injectable } from '@nestjs/common'
import { SuperTokensService } from '../../../auth/supertokens/supertokens.service'
import { EmailsService } from '../../../emails/emails.service'
import { EmailTemplates } from '../../../emails/templates/templates'
import { getLogger } from '../../../logging.module'
import { NewIdeaCommentDto } from '../../app-event-types/idea-comment/new-idea-comment.dto'
import { User } from '../../../users/user.entity'
import { UsersService } from '../../../users/users.service'
import { NewProposalCommentDto } from '../../app-event-types/proposal-comment/new-proposal-comment.dto'
import { AppEventReceiver } from '../../entities/app-event-receiver.entity'
import { AppEventData, AppEventType } from '../../entities/app-event-type'
import { AppEvent } from '../../entities/app-event.entity'

const logger = getLogger()

const EMAIL_NOTIFICATION_SUBJECT_PREFIX = '[BrightTreasury] '

interface EmailDetails {
    subject: string
    text: string
    data: AppEventData
    template: EmailTemplates
}

@Injectable()
export class EmailNotificationsService {
    constructor(
        private readonly emailsService: EmailsService,
        private readonly usersService: UsersService,
        private readonly superTokensService: SuperTokensService,
    ) {}

    async send(appEvent: AppEvent): Promise<void> {
        logger.info('Sending notification emails for event: ', appEvent)
        if (!appEvent.receivers) {
            logger.info('No receivers for this event - no emails will be sent')
            return
        }

        const to = await this.getEmails(appEvent.receivers)
        const details = this.getEmailDetails(appEvent)
        logger.info('Sending notification emails to: ', to)
        await Promise.all(
            to.map((email) =>
                this.emailsService.sendEmailFromTemplate(
                    email,
                    details.subject,
                    details.text,
                    details.template,
                    details.data,
                ),
            ),
        )
    }

    private async getEmails(receivers: AppEventReceiver[]): Promise<string[]> {
        const users = await this.usersService.find(receivers.map((receiver) => receiver.userId))

        const usersWithValidEmails = await Promise.all(
            users.map(async (receiver) => {
                const hasValidEmail = await this.hasValidEmail(receiver)
                return hasValidEmail ? receiver : undefined
            }),
        )
        return usersWithValidEmails.filter((user) => user !== undefined).map((user) => user!.email)
    }

    private async hasValidEmail(user: User): Promise<boolean> {
        if (!user.isEmailPasswordEnabled) {
            return false
        }
        return this.superTokensService.isEmailVerified(user)
    }

    private getEmailDetails(appEvent: AppEvent): EmailDetails {
        switch (appEvent.data.type) {
            case AppEventType.NewIdeaComment:
                return this.getNewIdeaCommentEmailDetails(appEvent.data)
            case AppEventType.NewProposalComment:
                return this.getNewProposalCommentEmailDetails(appEvent.data)
            default:
                // for exhaustiveness check - should never get here if all data types are coverd
                return appEvent.data
        }
    }

    private getNewIdeaCommentEmailDetails(data: NewIdeaCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Idea ${data.ideaOrdinalNumber} - new comments`
        const text = `You have a new comment in Idea ${data.ideaOrdinalNumber} ${data.ideaTitle}. You can see them here: ${data.commentsUrl}`
        return {
            subject,
            text,
            template: EmailTemplates.NewIdeaCommentTemplate,
            data,
        }
    }

    private getNewProposalCommentEmailDetails(data: NewProposalCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Proposal ${data.proposalBlockchainId} - new comments`
        const text = `You have a new comment in Proposal ${data.proposalBlockchainId} ${
            data.proposalTitle ?? ''
        }. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.NewProposalCommentTemplate,
            data,
        }
    }
}
