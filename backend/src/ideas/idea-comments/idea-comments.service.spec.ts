import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { IdeaCommentsService } from './idea-comments.service'
import { IdeaComment } from './entities/idea-comment.entity'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createIdea, createSessionData } from '../spec.helpers'
import { Idea } from '../entities/idea.entity'
import { IdeasService } from '../ideas.service'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { SessionData } from '../../auth/session/session.decorator'

describe('IdeaProposalDetailsService', () => {
    const app = beforeSetupFullApp()
    const getIdeaCommentsService = () => app.get().get(IdeaCommentsService)
    const getIdeasService = () => app.get().get(IdeasService)
    const getRepository = beforeAllSetup(() => app().get<Repository<IdeaComment>>(getRepositoryToken(IdeaComment)))
    let usr1SessionData: SessionData

    let idea: Idea
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        usr1SessionData = await createSessionData({ username: 'usr_1', email: 'usr_1@example.com' })
        idea = await createIdea({}, usr1SessionData, getIdeasService())
    })

    describe('create', () => {
        it('should create comment for existing idea', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const savedComment = (await getRepository().findOne(createdComment.id))!
            expect(savedComment.content).toBe('This is a comment')
        })
        it('should throw NotFoundException when creating a comment for non existing idea', async () => {
            await expect(
                getIdeaCommentsService().create('00000000-0000-0000-0000-000000000000', usr1SessionData.user, {
                    content: 'This is a comment',
                }),
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('get', () => {
        it('should return saved comment', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const foundComments = await getIdeaCommentsService().findAll(idea.id)

            expect(Array.isArray(foundComments)).toBe(true)
            expect(foundComments).toHaveLength(1)

            const [comment] = foundComments
            expect(comment.id).toBe(createdComment.id)
            expect(comment.createdAt.getTime()).toBe(createdComment.createdAt.getTime())
            expect(comment.idea).toBeUndefined()
            expect(comment.content).toBe(createdComment.content)
            expect(comment.thumbsUp).toBe(createdComment.thumbsUp)
            expect(comment.thumbsDown).toBe(createdComment.thumbsDown)

            const { id, username, isEmailPasswordEnabled } = usr1SessionData.user
            expect(comment.author).toMatchObject({ id, username, isEmailPasswordEnabled })
        })
        it('should throw NotFoundException when fetching comments for non existing idea', async () => {
            await expect(getIdeaCommentsService().findAll('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
                NotFoundException,
            )
        })
    })

    describe('delete', () => {
        it('should delete saved comment', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const commentsAfterCreate = await getIdeaCommentsService().findAll(idea.id)
            expect(commentsAfterCreate).toHaveLength(1)

            await getIdeaCommentsService().delete(idea.id, createdComment.id, usr1SessionData.user)
            const commentsAfterDelete = await getIdeaCommentsService().findAll(idea.id)
            expect(commentsAfterDelete).toHaveLength(0)
        })
        it('should throw NotFoundException when deleting comments for non existing idea', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            await expect(
                getIdeaCommentsService().delete(
                    '00000000-0000-0000-0000-000000000000',
                    createdComment.id,
                    usr1SessionData.user,
                ),
            ).rejects.toThrow(NotFoundException)
        })
        it('should throw NotFoundException when deleting non existing comment', async () => {
            await expect(
                getIdeaCommentsService().delete(idea.id, '00000000-0000-0000-0000-000000000000', usr1SessionData.user),
            ).rejects.toThrow(NotFoundException)
        })
        it('should throw ForbiddenException when deleting comment not owned by the user', async () => {
            const comment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const usr2SessionData = await createSessionData({ username: 'usr_2', email: 'usr_2@example.com' })
            await expect(getIdeaCommentsService().delete(idea.id, comment.id, usr2SessionData.user)).rejects.toThrow(
                ForbiddenException,
            )
        })
    })
})
