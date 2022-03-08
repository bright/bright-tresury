import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { CommentsService } from './comments.service'
import { CommentEntity } from './entites/comment.entity'
import { DiscussionCategory } from './entites/discussion-category'
import { DiscussionEntity } from './entites/discussion.entity'
import { v4 as uuid } from 'uuid'

describe('CommentsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<CommentsService>(CommentsService))
    const repository = beforeAllSetup(() => app().get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity)))
    const discussionRepository = beforeAllSetup(() =>
        app().get<Repository<DiscussionEntity>>(getRepositoryToken(DiscussionEntity)),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const { user: author } = await createSessionData()
        const discussion = await discussionRepository().save(
            discussionRepository().create({
                blockchainIndex: 1,
                networkId: NETWORKS.POLKADOT,
                category: DiscussionCategory.Bounty,
            }),
        )
        return { discussion, author }
    }

    describe('create', () => {
        it('should create entity', async () => {
            const { author, discussion } = await setUp()

            await service().create({ content: 'Some comment' }, author, discussion)

            const actual = await repository().findOne({ content: 'Some comment' })
            expect(actual).toBeDefined()
            expect(actual).toMatchObject({ authorId: author.id })
        })
        it('should return comment entity', async () => {
            const { author, discussion } = await setUp()

            const actual = await service().create({ content: 'Some comment' }, author, discussion)

            expect(actual).toMatchObject({ content: 'Some comment', authorId: author.id })
        })
    })

    describe('update', () => {
        const updateSetUp = async () => {
            const { author, discussion } = await setUp()
            const comment = await service().create({ content: 'Some comment' }, author, discussion)
            return { author, discussion, comment }
        }

        it('should update entity', async () => {
            const { author, comment } = await updateSetUp()

            await service().update(comment.id, { content: 'New comment' }, author)

            const actual = await repository().findOne(comment.id)
            expect(actual).toMatchObject({
                content: 'New comment',
            })
        })

        it('should update updatedAt', async () => {
            const { author, comment } = await updateSetUp()

            await service().update(comment.id, { content: 'New comment' }, author)

            const actual = await repository().findOne(comment.id)
            expect(actual!.createdAt).toStrictEqual(comment.createdAt)
            expect(actual!.updatedAt.getTime()).toBeGreaterThan(comment.updatedAt.getTime())
        })

        it(`should throw NotFound exception for not existing comment`, async () => {
            const { author } = await updateSetUp()

            await expect(service().update(uuid(), { content: 'New comment' }, author)).rejects.toThrow(
                NotFoundException,
            )
        })

        it(`should throw ForbiddenException exception for not comment author`, async () => {
            const { comment } = await updateSetUp()
            const { user } = await createSessionData({ email: 'other@example.com', username: 'other' })

            await expect(service().update(comment.id, { content: 'New comment' }, user)).rejects.toThrow(
                ForbiddenException,
            )
        })
    })
    describe('delete', () => {
        const deleteSetUp = async () => {
            const { author, discussion } = await setUp()
            const comment = await service().create({ content: 'Some comment' }, author, discussion)
            return { author, discussion, comment }
        }
        it('should delete comment entity', async () => {
            const { comment, author } = await deleteSetUp()

            await service().delete(comment.id, author)

            const actual = await repository().findOne(comment.id)
            expect(actual).toBeUndefined()
        })
        it(`should throw NotFound exception for not existing comment`, async () => {
            const { user } = await createSessionData({ email: 'other@example.com', username: 'other' })

            await expect(service().delete(uuid(), user)).rejects.toThrow(NotFoundException)
        })
        it(`should throw ForbiddenException exception for not comment author`, async () => {
            const { comment } = await deleteSetUp()
            const { user } = await createSessionData({ email: 'other@example.com', username: 'other' })

            await expect(service().delete(comment.id, user)).rejects.toThrow(ForbiddenException)
        })
    })
})
