import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { DiscussionCategory } from '../entites/discussion-category'
import { DiscussionEntity } from '../entites/discussion.entity'
import { CommentReactionsService } from './comment-reactions.service'
import { v4 as uuid } from 'uuid'
import { CommentReactionEntity, ReactionType } from './entities/comment-reaction.entity'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { CommentEntity } from '../entites/comment.entity'
import { createSessionData } from '../../ideas/spec.helpers'

describe('CommentsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<CommentReactionsService>(CommentReactionsService))
    const repository = beforeAllSetup(() =>
        app().get<Repository<CommentReactionEntity>>(getRepositoryToken(CommentReactionEntity)),
    )
    const commentsRepository = beforeAllSetup(() =>
        app().get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity)),
    )
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
        const comment = await commentsRepository().save(
            commentsRepository().create({ author, discussion, content: 'Some content' }),
        )
        return { discussion, author, comment }
    }

    describe('create', () => {
        it('should create entity', async () => {
            const { author, comment } = await setUp()

            await service().create({ name: ReactionType.ThumbUp }, comment.id, author)

            const actual = await repository().findOne({ commentId: comment.id })
            expect(actual).toBeDefined()
            expect(actual).toMatchObject({ authorId: author.id, name: ReactionType.ThumbUp })
        })

        it('should return comment entity', async () => {
            const { author, comment } = await setUp()

            const actual = await service().create({ name: ReactionType.ThumbUp }, comment.id, author)

            expect(actual).toMatchObject({ authorId: author.id, name: ReactionType.ThumbUp })
        })

        it('should throw not found exception for not existing comment', async () => {
            const { author } = await setUp()

            return expect(service().create({ name: ReactionType.ThumbUp }, uuid(), author)).rejects.toThrow(
                NotFoundException,
            )
        })

        it('should throw ForbiddenException when a user is trying to add another reaction of the same type', async () => {
            const { author, comment } = await setUp()
            await service().create({ name: ReactionType.ThumbUp }, comment.id, author)

            return expect(service().create({ name: ReactionType.ThumbUp }, comment.id, author)).rejects.toThrow(
                ForbiddenException,
            )
        })

        it('should resolve when a user is trying to add reaction of the same type but for different comment', async () => {
            const { author, comment, discussion } = await setUp()
            await service().create({ name: ReactionType.ThumbUp }, comment.id, author)

            const anotherComment = await commentsRepository().save(
                commentsRepository().create({ author, discussion, content: 'Some content' }),
            )

            return expect(
                service().create({ name: ReactionType.ThumbUp }, anotherComment.id, author),
            ).resolves.toBeDefined()
        })
    })

    describe('delete', () => {
        const deleteSetUp = async () => {
            const { author, comment } = await setUp()
            const reaction = await service().create({ name: ReactionType.ThumbUp }, comment.id, author)
            return { author, comment, reaction }
        }
        it('should delete comment reaction entity', async () => {
            const { reaction, author } = await deleteSetUp()

            await service().delete(reaction.id, author)

            const actual = await repository().findOne(reaction.id)
            expect(actual).toBeUndefined()
        })

        it(`should throw NotFound exception for not existing reaction`, async () => {
            const { user } = await createSessionData({ email: 'other@example.com', username: 'other' })

            await expect(service().delete(uuid(), user)).rejects.toThrow(NotFoundException)
        })

        it(`should throw ForbiddenException exception for not reaction author`, async () => {
            const { reaction } = await deleteSetUp()
            const { user: otherUser } = await createSessionData({ email: 'other@example.com', username: 'other' })

            await expect(service().delete(reaction.id, otherUser)).rejects.toThrow(ForbiddenException)
        })
    })
})
