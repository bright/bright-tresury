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

describe('IdeaCommentsServiceSpec', () => {
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

    describe('create idea comment', () => {
        it('should create comment for existing idea', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const savedIdeaComment = (await getRepository().findOne(createdComment.id, { relations: ['comment'] }))!
            const { comment } = savedIdeaComment
            expect(comment.content).toBe('This is a comment')
        })
        it(`should throw ${NotFoundException} when creating a comment for non existing idea`, async () => {
            await expect(
                getIdeaCommentsService().create('00000000-0000-0000-0000-000000000000', usr1SessionData.user, {
                    content: 'This is a comment',
                }),
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('get idea comment(s)', () => {
        it('should return saved comment', async () => {
            const createdIdeaComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const foundIdeaComment = await getIdeaCommentsService().findOne(idea.id, createdIdeaComment.comment.id)
            expect(foundIdeaComment.id).toBe(createdIdeaComment.id)
            expect(foundIdeaComment.idea.id).toEqual(createdIdeaComment.idea.id)
            expect(foundIdeaComment.comment.id).toEqual(createdIdeaComment.comment.id)
            expect(foundIdeaComment.comment.content).toEqual(createdIdeaComment.comment.content)
        })
        it('should return saved comments', async () => {
            const createdIdeaComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })

            const foundComments = await getIdeaCommentsService().findAll(idea.id)
            expect(Array.isArray(foundComments)).toBe(true)
            expect(foundComments).toHaveLength(1)

            const [foundIdeaComment] = foundComments
            expect(foundIdeaComment.id).toBe(createdIdeaComment.id)
            expect(foundIdeaComment.idea).toBeUndefined()
            expect(foundIdeaComment.comment.id).toEqual(createdIdeaComment.comment.id)
            expect(foundIdeaComment.comment.createdAt.getTime()).toBe(createdIdeaComment.comment.createdAt.getTime())
            expect(foundIdeaComment.comment.content).toEqual(createdIdeaComment.comment.content)
            expect(foundIdeaComment.comment.content).toBe(createdIdeaComment.comment.content)
            expect(foundIdeaComment.comment.thumbsUp).toBe(createdIdeaComment.comment.thumbsUp)
            expect(foundIdeaComment.comment.thumbsDown).toBe(createdIdeaComment.comment.thumbsDown)

            const { id, username, isEmailPasswordEnabled } = usr1SessionData.user
            expect(foundIdeaComment.comment.author).toMatchObject({ id, username, isEmailPasswordEnabled })
        })
        it('should return empty array when fetching comments for non existing idea', async () => {
            const ideaComments = await getIdeaCommentsService().findAll('00000000-0000-0000-0000-000000000000')
            expect(Array.isArray(ideaComments)).toBe(true)
            expect(ideaComments).toHaveLength(0)
        })
    })

    describe('delete idea comment', () => {
        it('should delete saved comment', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
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
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const usr2SessionData = await createSessionData({ username: 'usr_2', email: 'usr_2@example.com' })
            await expect(
                getIdeaCommentsService().delete(idea.id, createdComment.comment.id, usr2SessionData.user),
            ).rejects.toThrow(ForbiddenException)
        })
    })
    describe('update idea comment', () => {
        it('should update idea comment', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })

            await getIdeaCommentsService().update(idea.id, createdComment.id, { content: 'Edit' }, usr1SessionData.user)
            const updatedComment = (await getRepository().findOne(createdComment.id))!
            expect(updatedComment.id).toBe(createdComment.id)
            expect(updatedComment.comment.createdAt.getTime()).toBe(createdComment.comment.createdAt.getTime())
            expect(updatedComment.comment.updatedAt.getTime()).not.toBe(createdComment.comment.updatedAt.getTime())
            expect(updatedComment.comment.content).toBe('Edit')
            expect(updatedComment.comment.thumbsUp).toBe(createdComment.comment.thumbsUp)
            expect(updatedComment.comment.thumbsDown).toBe(createdComment.comment.thumbsDown)
        })

        it('should throw ForbiddenException when updating other user idea comment', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            const usr2SessionData = await createSessionData({ username: 'usr_2', email: 'usr_2@example.com' })
            await expect(
                getIdeaCommentsService().update(
                    idea.id,
                    createdComment.comment.id,
                    { content: 'Edit' },
                    usr2SessionData.user,
                ),
            ).rejects.toThrow(ForbiddenException)
        })

        it('should throw NotFoundException when updating comment to wrong idea', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            await expect(
                getIdeaCommentsService().update(
                    '00000000-0000-0000-0000-000000000000',
                    createdComment.comment.id,
                    { content: 'Edit' },
                    usr1SessionData.user,
                ),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException when updating comment with wrong id', async () => {
            const createdComment = await getIdeaCommentsService().create(idea.id, usr1SessionData.user, {
                content: 'This is a comment',
            })
            await expect(
                getIdeaCommentsService().update(
                    idea.id,
                    '00000000-0000-0000-0000-000000000000',
                    { content: 'Edit' },
                    usr1SessionData.user,
                ),
            ).rejects.toThrow(NotFoundException)
        })
    })
})
