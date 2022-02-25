import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { IdeaCommentsService } from './idea-comments.service'
import { IdeaCommentEntity } from './entities/idea-comment.entity'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createIdea, createSessionData } from '../spec.helpers'
import { IdeasService } from '../ideas.service'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { IdeaStatus } from '../entities/idea-status'

describe('IdeaCommentsServiceSpec', () => {
    const app = beforeSetupFullApp()
    const getIdeaCommentsService = () => app.get().get(IdeaCommentsService)
    const getIdeasService = () => app.get().get(IdeasService)
    const getRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaCommentEntity>>(getRepositoryToken(IdeaCommentEntity)),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const usr1SessionData = await createSessionData({ username: 'usr_1', email: 'usr_1@example.com' })
        const idea = await createIdea({}, usr1SessionData, getIdeasService())
        const IDEA_ID = '00000000-0000-0000-0000-000000000000'
        const content = { content: 'This is a comment' }
        return {
            usr1SessionData,
            idea,
            IDEA_ID,
            content,
        }
    }

    describe('create idea comment', () => {
        it('should create comment for existing idea', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const savedIdeaComment = (await getRepository().findOne(createdComment.id, { relations: ['comment'] }))!
            const { comment } = savedIdeaComment
            expect(comment.content).toBe('This is a comment')
        })

        it(`should throw NotFoundException when creating a comment for non existing idea`, async () => {
            const { usr1SessionData, IDEA_ID, content } = await setUp()
            const promiseIdea = getIdeaCommentsService().create(IDEA_ID, usr1SessionData.user, content)
            await expect(promiseIdea).rejects.toThrow(NotFoundException)
        })

        it(`should throw BadRequestException when creating a comment for draft idea`, async () => {
            const { usr1SessionData, content } = await setUp()
            const draftIdea = await createIdea({ status: IdeaStatus.Draft }, usr1SessionData, getIdeasService())
            const ideaComment = getIdeaCommentsService().create(draftIdea.id, usr1SessionData.user, content)
            await expect(ideaComment).rejects.toThrow(BadRequestException)
        })
    })

    describe('get idea comment(s)', () => {
        it('should return saved comment', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const createdIdeaComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const foundIdeaComment = await getIdeaCommentsService().findOne(idea.id, createdIdeaComment.comment.id)
            expect(foundIdeaComment).toMatchObject({
                id: createdIdeaComment.id,
                idea: {
                    id: createdIdeaComment.idea!.id,
                },
                comment: {
                    id: createdIdeaComment.comment.id,
                    content: createdIdeaComment.comment.content,
                },
            })
        })
        it('should return comment', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const createdIdeaComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)

            const foundComments = await getIdeaCommentsService().findAll(idea.id)
            expect(Array.isArray(foundComments)).toBe(true)
            expect(foundComments).toHaveLength(1)

            const [foundIdeaComment] = foundComments
            expect(foundIdeaComment).toMatchObject({
                id: createdIdeaComment.id,
                idea: undefined,
                comment: {
                    id: createdIdeaComment.comment.id,
                    createdAt: createdIdeaComment.comment.createdAt,
                    content: createdIdeaComment.comment.content,
                    thumbsUp: createdIdeaComment.comment.thumbsUp,
                    thumbsDown: createdIdeaComment.comment.thumbsDown,
                    author: {
                        id: usr1SessionData.user.id,
                        username: usr1SessionData.user.username,
                        status: usr1SessionData.user.status,
                    },
                },
            })
        })
        it('should return empty array when fetching comments for non existing idea', async () => {
            const { IDEA_ID } = await setUp()
            const ideaComments = await getIdeaCommentsService().findAll(IDEA_ID)
            expect(Array.isArray(ideaComments)).toBe(true)
            expect(ideaComments).toHaveLength(0)
        })
    })

    describe('delete idea comment', () => {
        it('should delete saved comment', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const { comment: createdComment } = await getIdeaCommentsService().create(
                idea.id,
                usr1SessionData.user,
                content,
            )
            const commentsAfterCreate = await getRepository().find({
                where: { idea: { id: idea.id } },
            })
            expect(commentsAfterCreate).toHaveLength(1)

            await getIdeaCommentsService().delete(idea.id, createdComment.id, usr1SessionData.user)
            const commentsAfterDelete = await getRepository().find({
                where: { idea: { id: idea.id } },
            })
            expect(commentsAfterDelete).toHaveLength(0)
        })
        it('should throw NotFoundException when deleting comments for non existing idea', async () => {
            const { usr1SessionData, idea, IDEA_ID, content } = await setUp()
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            await expect(
                getIdeaCommentsService().delete(IDEA_ID, createdComment.id, usr1SessionData.user),
            ).rejects.toThrow(NotFoundException)
        })
        it('should throw NotFoundException when deleting non existing comment', async () => {
            const { usr1SessionData, idea, IDEA_ID } = await setUp()
            const deleteCommentPromise = getIdeaCommentsService().delete(idea.id, IDEA_ID, usr1SessionData.user)
            await expect(deleteCommentPromise).rejects.toThrow(NotFoundException)
        })
        it('should throw ForbiddenException when deleting comment not owned by the user', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const usr2SessionData = await createSessionData({ username: 'usr_2', email: 'usr_2@example.com' })
            const deleteCommentPromise = getIdeaCommentsService().delete(
                idea.id,
                createdComment.comment.id,
                usr2SessionData.user,
            )
            await expect(deleteCommentPromise).rejects.toThrow(ForbiddenException)
        })
    })
    describe('update idea comment', () => {
        it('should update idea comment', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const createdIdeaComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const { comment: createdComment } = createdIdeaComment
            await getIdeaCommentsService().update(idea.id, createdComment.id, { content: 'Edit' }, usr1SessionData.user)
            const { comment: updatedComment } = (await getRepository().findOne(createdIdeaComment.id))!
            expect(updatedComment).toMatchObject({
                id: createdComment.id,
                createdAt: createdComment.createdAt,
                content: 'Edit',
                thumbsUp: createdComment.thumbsUp,
                thumbsDown: createdComment.thumbsDown,
            })
            expect(updatedComment.updatedAt.getTime()).not.toBe(createdComment.updatedAt.getTime())
        })

        it('should throw ForbiddenException when updating other user idea comment', async () => {
            const { usr1SessionData, idea, content } = await setUp()
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const usr2SessionData = await createSessionData({ username: 'usr_2', email: 'usr_2@example.com' })
            const updateCommentPromise = getIdeaCommentsService().update(
                idea.id,
                createdComment.comment.id,
                { content: 'Edit' },
                usr2SessionData.user,
            )
            await expect(updateCommentPromise).rejects.toThrow(ForbiddenException)
        })

        it('should throw NotFoundException when updating comment to wrong idea', async () => {
            const { usr1SessionData, idea, IDEA_ID, content } = await setUp()
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const updateCommentPromise = getIdeaCommentsService().update(
                IDEA_ID,
                createdComment.comment.id,
                { content: 'Edit' },
                usr1SessionData.user,
            )
            await expect(updateCommentPromise).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException when updating comment with wrong id', async () => {
            const { usr1SessionData, idea, IDEA_ID, content } = await setUp()
            await getIdeaCommentsService().create(idea.id, usr1SessionData.user, content)
            const updateCommentPromise = getIdeaCommentsService().update(
                idea.id,
                IDEA_ID,
                { content: 'Edit' },
                usr1SessionData.user,
            )
            await expect(updateCommentPromise).rejects.toThrow(NotFoundException)
        })
    })
})
