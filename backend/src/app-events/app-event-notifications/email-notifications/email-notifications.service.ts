import { Injectable } from '@nestjs/common'
import { SuperTokensService } from '../../../auth/supertokens/supertokens.service'
import { EmailsService } from '../../../emails/emails.service'
import { EmailTemplates } from '../../../emails/templates/templates'
import { getLogger } from '../../../logging.module'
import { NewBountyCommentDto } from '../../app-event-types/bounty-comment/new-bounty-comment.dto'
import { NewIdeaCommentDto } from '../../app-event-types/idea-comment/new-idea-comment.dto'
import { UserEntity } from '../../../users/entities/user.entity'
import { UsersService } from '../../../users/users.service'
import { NewProposalCommentDto } from '../../app-event-types/proposal-comment/new-proposal-comment.dto'
import { AppEventReceiverEntity } from '../../entities/app-event-receiver.entity'
import { AppEventData, AppEventType } from '../../entities/app-event-type'
import { AppEventEntity } from '../../entities/app-event.entity'
import { UserStatus } from '../../../users/entities/user-status'
import { NewTipCommentDto } from '../../app-event-types/tip-comment/new-tip-comment.dto'
import { NewChildBountyCommentDto } from '../../app-event-types/childBounty-comment/new-childBounty-comment.dto'

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

    async send(appEvent: AppEventEntity): Promise<void> {
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

    private async getEmails(receivers: AppEventReceiverEntity[]): Promise<string[]> {
        const users = await this.usersService.find(receivers.map((receiver) => receiver.userId))

        const usersWithValidEmails = await Promise.all(
            users.map(async (receiver) => {
                if (!receiver.isEmailNotificationEnabled) {
                    return undefined
                }
                const hasValidEmail = await this.hasValidEmail(receiver)
                return hasValidEmail ? receiver : undefined
            }),
        )
        return usersWithValidEmails.filter((user) => user !== undefined).map((user) => user!.email)
    }

    private async hasValidEmail(user: UserEntity): Promise<boolean> {
        if (user.status !== UserStatus.EmailPasswordEnabled) {
            return false
        }
        return this.superTokensService.isEmailVerified(user)
    }

    private getEmailDetails(appEvent: AppEventEntity): EmailDetails {
        switch (appEvent.data.type) {
            case AppEventType.NewIdeaComment:
                return this.getNewIdeaCommentEmailDetails(appEvent.data)
            case AppEventType.NewProposalComment:
                return this.getNewProposalCommentEmailDetails(appEvent.data)
            case AppEventType.NewBountyComment:
                return this.getNewBountyCommentEmailDetails(appEvent.data)
            case AppEventType.NewChildBountyComment:
                return this.getNewChildBountyCommentEmailDetails(appEvent.data)
            case AppEventType.NewTipComment:
                return this.getNewTipCommentEmailDetails(appEvent.data)
            case AppEventType.TaggedInIdeaComment:
                return this.getTaggedInIdeaCommentEmailDetails(appEvent.data)
            case AppEventType.TaggedInProposalComment:
                return this.getTaggedInProposalCommentEmailDetails(appEvent.data)
            case AppEventType.TaggedInBountyComment:
                return this.getTaggedInBountyCommentEmailDetails(appEvent.data)
            case AppEventType.TaggedInChildBountyComment:
                return this.getTaggedInChildBountyCommentEmailDetails(appEvent.data)
            case AppEventType.TaggedInTipComment:
                return this.getTaggedInTipCommentEmailDetails(appEvent.data)

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

    private getTaggedInIdeaCommentEmailDetails(data: NewIdeaCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Idea ${data.ideaOrdinalNumber} - You have been tagged`
        const text = `You have been tagged in Idea ${data.ideaOrdinalNumber} ${data.ideaTitle}. You can see them here: ${data.commentsUrl}`
        return {
            subject,
            text,
            template: EmailTemplates.TaggedInIdeaCommentTemplate,
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

    private getTaggedInProposalCommentEmailDetails(data: NewProposalCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Proposal ${data.proposalBlockchainId} - You have been tagged`
        const text = `You have been tagged in Proposal ${data.proposalBlockchainId} ${
            data.proposalTitle ?? ''
        }. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.TaggedInProposalCommentTemplate,
            data,
        }
    }

    private getNewBountyCommentEmailDetails(data: NewBountyCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Bounty ${data.bountyBlockchainId} - new comments`
        const text = `You have a new comment in Bounty ${data.bountyBlockchainId} ${
            data.bountyTitle ?? ''
        }. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.NewBountyCommentTemplate,
            data,
        }
    }

    private getTaggedInBountyCommentEmailDetails(data: NewBountyCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Bounty ${data.bountyBlockchainId} - You have been tagged`
        const text = `You have been tagged in Bounty ${data.bountyBlockchainId} ${
            data.bountyTitle ?? ''
        }. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.TaggedInBountyCommentTemplate,
            data,
        }
    }

    private getNewChildBountyCommentEmailDetails(data: NewChildBountyCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Child Bounty ${data.bountyBlockchainId} - ${data.childBountyBlockchainId} - new comments`
        const text = `You have a new comment in Child Bounty ${data.bountyBlockchainId} - ${
            data.childBountyBlockchainId
        } ${data.childBountyTitle ?? ''}. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.NewChildBountyCommentTemplate,
            data,
        }
    }

    private getTaggedInChildBountyCommentEmailDetails(data: NewChildBountyCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Child Bounty ${data.bountyBlockchainId} - ${data.childBountyBlockchainId} - You have been tagged`
        const text = `You have been tagged in Child Bounty ${data.bountyBlockchainId} - ${
            data.childBountyBlockchainId
        } ${data.childBountyTitle ?? ''}. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.TaggedInChildBountyCommentTemplate,
            data,
        }
    }

    private getNewTipCommentEmailDetails(data: NewTipCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Tip ${data.tipHash} - new comments`
        const text = `You have a new comment in Tip ${data.tipTitle ?? ''}. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.NewTipCommentTemplate,
            data,
        }
    }

    private getTaggedInTipCommentEmailDetails(data: NewTipCommentDto): EmailDetails {
        const subject = `${EMAIL_NOTIFICATION_SUBJECT_PREFIX}Tip ${data.tipHash} - You have been tagged`
        const text = `You have been tagged in Tip ${data.tipTitle ?? ''}. You can see them here: ${data.commentsUrl}`

        return {
            subject,
            text,
            template: EmailTemplates.TaggedInTipCommentTemplate,
            data,
        }
    }
}
