import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    createWeb3SessionHandler,
} from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { EmailsService } from '../../../emails/emails.service'
import { EmailTemplates } from '../../../emails/templates/templates'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../../utils/spec.helpers'
import { NewProposalCommentDto } from '../../app-event-types/proposal-comment/new-proposal-comment.dto'
import { AppEventData, AppEventType } from '../../entities/app-event-type'
import { createAppEvent } from '../../spec.helpers'
import { EmailNotificationsService } from './email-notifications.service'
import SpyInstance = jest.SpyInstance

describe('EmailNotificationsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<EmailNotificationsService>(EmailNotificationsService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    describe('send', () => {
        it('should call sendEmailFromTemplate function of EmailsService', async () => {
            const {
                sessionData: { user },
            } = await createUserSessionHandlerWithVerifiedEmail(app())
            const appEvent = createAppEvent([user.id])
            const spy = jest.spyOn(app().get<EmailsService>(EmailsService), 'sendEmail')

            await service().send(appEvent)

            expect(spy).toHaveBeenCalledWith(user.email, expect.anything(), expect.anything(), expect.anything())
        })

        it('should not call sendEmailFromTemplate function when user has not enabled email-password login', async () => {
            const {
                sessionData: { user },
            } = await createWeb3SessionHandler(app(), '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            const appEvent = createAppEvent([user.id])
            const spy = jest.spyOn(app().get<EmailsService>(EmailsService), 'sendEmail')

            await service().send(appEvent)

            expect(spy).toHaveBeenCalledTimes(0)
        })

        it('should not call sendEmailFromTemplate function when user did not verify email', async () => {
            const {
                sessionData: { user },
            } = await createUserSessionHandler(app())
            const appEvent = createAppEvent([user.id])
            const spy = jest.spyOn(app().get<EmailsService>(EmailsService), 'sendEmail')

            await service().send(appEvent)

            expect(spy).toHaveBeenCalledTimes(0)
        })
    })

    describe('send (for each event type)', () => {
        let sendEmailFromTemplateSpy: SpyInstance
        let sendEmailSpy: SpyInstance

        beforeEach(() => {
            sendEmailFromTemplateSpy = jest.spyOn(app().get<EmailsService>(EmailsService), 'sendEmailFromTemplate')
            sendEmailSpy = jest.spyOn(app().get<EmailsService>(EmailsService), 'sendEmail')
        })

        const expectSendEmailFromTemplateToHaveBeenCalledWith = (template: EmailTemplates, data: AppEventData) => {
            expect(sendEmailFromTemplateSpy).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                template,
                expect.objectContaining(data),
            )
        }
        const expectSendEmailToHaveBeenCalledWithNotEmptyHtml = () => {
            expect(sendEmailSpy).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.not.stringMatching('^(?![\\s\\S])'),
            )
        }

        it('should call sendEmailFromTemplate and sendEmail for NewIdeaComment event', async () => {
            const {
                sessionData: { user },
            } = await createUserSessionHandlerWithVerifiedEmail(app())
            const data = {
                type: AppEventType.NewIdeaComment as const,
                ideaId: uuid(),
                commentId: uuid(),
                ideaOrdinalNumber: 9,
                ideaTitle: 'title',
                commentsUrl: 'http://localhost3000',
            }
            const appEvent = createAppEvent([user.id], data)

            await service().send(appEvent)

            expectSendEmailFromTemplateToHaveBeenCalledWith(EmailTemplates.NewIdeaCommentTemplate, appEvent.data)
            expectSendEmailToHaveBeenCalledWithNotEmptyHtml()
        })

        it('should call sendEmailFromTemplate and sendEmail for NewProposalComment event', async () => {
            const {
                sessionData: { user },
            } = await createUserSessionHandlerWithVerifiedEmail(app())
            const data: NewProposalCommentDto = {
                type: AppEventType.NewProposalComment as const,
                commentId: uuid(),
                networkId: 'polkadot',
                proposalBlockchainId: '0',
                title: 'title',
            }
            const appEvent = createAppEvent([user.id], data)

            await service().send(appEvent)

            expectSendEmailFromTemplateToHaveBeenCalledWith(EmailTemplates.NewProposalCommentTemplate, appEvent.data)
            expectSendEmailToHaveBeenCalledWithNotEmptyHtml()
        })
    })
})
