import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { IdeaCommentsService } from './idea-comments.service'
import { IdeaComment } from './entities/idea-comment.entity'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { createIdea } from '../spec.helpers'
import { Idea } from '../entities/idea.entity'
import { IdeasService } from '../ideas.service'
import { HttpStatus, NotFoundException } from '@nestjs/common'

describe('IdeaProposalDetailsService', () => {
    const app = beforeSetupFullApp()
    const getIdeaCommentsService = () => app.get().get(IdeaCommentsService)
    const getIdeasService = () => app.get().get(IdeasService)
    const getRepository = beforeAllSetup(() => app().get<Repository<IdeaComment>>(getRepositoryToken(IdeaComment)))
    let sessionHandler: SessionHandler
    let idea: Idea
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        idea = await createIdea({}, sessionHandler.sessionData, getIdeasService())
    })

    describe('create', () => {
        it('should create comment for existing idea', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, sessionHandler.sessionData.user, {
                content: 'This is a comment',
            })
            const savedComment = (await getRepository().findOne(createdComment.id))!
            expect(savedComment.content).toBe('This is a comment')
        })
        it('should throw NotFoundException when creating a comment for non existing idea', async () => {
            await expect(
                getIdeaCommentsService().create(
                    '00000000-0000-0000-0000-000000000000',
                    sessionHandler.sessionData.user,
                    { content: 'This is a comment' },
                ),
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('get', () => {
        it('should return saved comment', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, sessionHandler.sessionData.user, {
                content: 'This is a comment',
            })
            const foundComments = await getIdeaCommentsService().findAll(idea.id)

            expect(Array.isArray(foundComments)).toBe(true)
            expect(foundComments.length).toBe(1)

            const [comment] = foundComments
            expect(comment.id).toBe(createdComment.id)
            expect(comment.createdAt.getTime()).toBe(createdComment.createdAt.getTime())
            expect(comment.idea).toBeUndefined()
            expect(comment.content).toBe(createdComment.content)
            expect(comment.thumbsUp).toBe(createdComment.thumbsUp)
            expect(comment.thumbsDown).toBe(createdComment.thumbsDown)

            const { id, username, isEmailPasswordEnabled } = sessionHandler.sessionData.user
            expect(comment.author).toMatchObject({ id, username, isEmailPasswordEnabled })
        })
        it('should throw NotFoundException when fetching comments for non existing idea', async () => {
            await expect(getIdeaCommentsService().findAll('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
                NotFoundException,
            )
        })
    })
})
