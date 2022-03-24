import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { UserStatus } from '../../users/entities/user-status'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { DiscussionsService } from '../discussions.service'
import { IdeaDiscussionDto } from '../dto/discussion-category/idea-discussion.dto'
import { DiscussionCategory } from '../entites/discussion-category'
import { CommentReactionsService } from './comment-reactions.service'
import { ReactionType } from './entities/comment-reaction.entity'

const baseUrl = (commentId: any) => `/api/v1/comments/${commentId}/reactions`

describe('/api/v1/comments/:id/reactions', () => {
    const app = beforeSetupFullApp()
    const discussionService = beforeAllSetup(() => app().get<DiscussionsService>(DiscussionsService))
    const reactionsService = beforeAllSetup(() => app().get<CommentReactionsService>(CommentReactionsService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const comment = await discussionService().addComment(
            {
                content: 'content',
                discussionDto: { category: DiscussionCategory.Idea, entityId: uuid() } as IdeaDiscussionDto,
            },
            sessionHandler.sessionData.user,
        )

        return { sessionHandler, comment }
    }

    describe('POST', () => {
        const validDto = {
            name: ReactionType.ThumbUp,
        }
        it(`should return ${HttpStatus.CREATED}`, async () => {
            const { sessionHandler, comment } = await setUp()

            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl(comment.id)).send(validDto))
                .expect(HttpStatus.CREATED)
        })

        it(`should return created reaction`, async () => {
            const dto = {
                name: ReactionType.ThumbUp,
            }
            const { sessionHandler, comment } = await setUp()

            const result = await sessionHandler.authorizeRequest(request(app()).post(baseUrl(comment.id)).send(dto))

            expect(result.body).toStrictEqual({
                id: expect.anything(),
                name: dto.name,
                author: expect.objectContaining({
                    userId: sessionHandler.sessionData.user.id,
                    status: UserStatus.EmailPasswordEnabled,
                    username: sessionHandler.sessionData.user.username,
                }),
                createdAt: expect.any(Number),
                updatedAt: expect.any(Number),
            })
        })

        it(`should call service create method`, async () => {
            const { sessionHandler, comment } = await setUp()
            const spy = jest.spyOn(reactionsService(), 'create')

            await sessionHandler.authorizeRequest(request(app()).post(baseUrl(comment.id)).send(validDto))

            expect(spy).toHaveBeenCalledWith(
                validDto,
                comment.id,
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for empty reaction name`, async () => {
            const { sessionHandler, comment } = await setUp()

            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl(comment.id)).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not-known reaction name`, async () => {
            const { sessionHandler, comment } = await setUp()

            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl(comment.id)).send({ name: 'unknown' }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { comment } = await setUp()
            request(app()).post(baseUrl(comment.id)).send(validDto).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified email`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app())
            notVerifiedSessionHandler
                .authorizeRequest(request(app()).post(baseUrl(uuid())).send(validDto))
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('DELETE', () => {
        const validDto = {
            name: ReactionType.ThumbUp,
        }

        const deleteSetUp = async () => {
            const { sessionHandler, comment } = await setUp()
            const reaction = await reactionsService().create(
                { name: ReactionType.ThumbUp },
                comment.id,
                sessionHandler.sessionData.user,
            )
            return { sessionHandler, comment, reaction }
        }

        it(`should return ${HttpStatus.OK}`, async () => {
            const { sessionHandler, comment, reaction } = await deleteSetUp()

            return sessionHandler
                .authorizeRequest(request(app()).delete(`${baseUrl(comment.id)}/${reaction.id}`))
                .expect(HttpStatus.OK)
        })

        it(`should call service delete method`, async () => {
            const { sessionHandler, comment, reaction } = await deleteSetUp()
            const spy = jest.spyOn(reactionsService(), 'delete')

            await sessionHandler.authorizeRequest(request(app()).delete(`${baseUrl(comment.id)}/${reaction.id}`))

            expect(spy).toHaveBeenCalledWith(
                reaction.id,
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { comment, reaction } = await deleteSetUp()
            request(app())
                .delete(`${baseUrl(comment.id)}/${reaction.id}`)
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified email`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app())
            notVerifiedSessionHandler
                .authorizeRequest(request(app()).delete(`${baseUrl(uuid())}/${uuid()}`))
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
