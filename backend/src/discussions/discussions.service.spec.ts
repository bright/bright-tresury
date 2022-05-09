import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { DiscussionsService } from './discussions.service'
import { BountyDiscussionDto } from './dto/discussion-category/bounty-discussion.dto'
import { IdeaDiscussionDto } from './dto/discussion-category/idea-discussion.dto'
import { ProposalDiscussionDto } from './dto/discussion-category/proposal-discussion.dto'
import { DiscussionDto } from './dto/discussion.dto'
import { CommentEntity } from './entites/comment.entity'
import { DiscussionCategory } from './entites/discussion-category'
import { DiscussionEntity } from './entites/discussion.entity'
import { v4 as uuid } from 'uuid'
import { TipDiscussionDto } from './dto/discussion-category/tip-discussion.dto'

describe('DiscussionsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<DiscussionsService>(DiscussionsService))
    const repository = beforeAllSetup(() =>
        app().get<Repository<DiscussionEntity>>(getRepositoryToken(DiscussionEntity)),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('findOne', () => {
        it('should return existing discussion', async () => {
            const discussion = await repository().save(
                repository().create({
                    category: DiscussionCategory.Proposal,
                    blockchainIndex: 1,
                    networkId: NETWORKS.POLKADOT,
                }),
            )

            const actual = await service().findOne(discussion.id)

            expect(actual).toMatchObject(discussion)
        })

        it('should return undefined for not exisitng discussion', async () => {
            const actual = await service().findOne(uuid())

            expect(actual).toBeUndefined()
        })
    })

    describe('findComments', () => {
        const findCommentsSetUp = async () => {
            const { user: author } = await createSessionData()
            const addComment = (discussionDto: DiscussionDto) =>
                service().addComment(
                    {
                        content: 'some comment',
                        discussionDto,
                    },
                    author,
                )

            return { author, addComment }
        }
        it('should return proposal comment', async () => {
            const { addComment } = await findCommentsSetUp()
            const proposalComment = await addComment({
                category: DiscussionCategory.Proposal,
                blockchainIndex: 1,
                networkId: NETWORKS.POLKADOT,
            } as ProposalDiscussionDto)

            const actual = await service().findComments({
                category: DiscussionCategory.Proposal,
                blockchainIndex: 1,
                networkId: NETWORKS.POLKADOT,
            })

            expect(actual).toHaveLength(1)
            expect(actual[0].id).toBe(proposalComment.id)
        })

        it('should return bounty comment', async () => {
            const { addComment } = await findCommentsSetUp()
            const bountyComment = await addComment({
                category: DiscussionCategory.Bounty,
                blockchainIndex: 1,
                networkId: NETWORKS.POLKADOT,
            } as BountyDiscussionDto)

            const actual = await service().findComments({
                category: DiscussionCategory.Bounty,
                blockchainIndex: 1,
                networkId: NETWORKS.POLKADOT,
            })

            expect(actual).toHaveLength(1)
            expect(actual[0].id).toBe(bountyComment.id)
        })

        it('should return idea comment', async () => {
            const { addComment } = await findCommentsSetUp()
            const ideaEntityId = uuid()
            const ideaComment = await addComment({
                category: DiscussionCategory.Idea,
                entityId: ideaEntityId,
            } as IdeaDiscussionDto)

            const actual = await service().findComments({
                category: DiscussionCategory.Idea,
                entityId: ideaEntityId,
            })

            expect(actual).toHaveLength(1)
            expect(actual[0].id).toBe(ideaComment.id)
        })

        it('should return tip comment', async () => {
            const { addComment } = await findCommentsSetUp()
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipComment = await addComment({
                category: DiscussionCategory.Tip,
                blockchainHash: tipHash,
                networkId: NETWORKS.POLKADOT,
            } as TipDiscussionDto)

            const actual = await service().findComments({
                category: DiscussionCategory.Tip,
                blockchainHash: tipHash,
                networkId: NETWORKS.POLKADOT,
            })

            expect(actual).toHaveLength(1)
            expect(actual[0].id).toBe(tipComment.id)
        })
    })

    describe('addComment', () => {
        const discussionDto = {
            category: DiscussionCategory.Bounty as const,
            blockchainIndex: 1,
            networkId: NETWORKS.POLKADOT,
        }
        const createCommentDto = {
            content: 'Comment content',
            discussionDto,
        }

        describe('when discussion does not exist', () => {
            const setUp = async () => {
                const { user: author } = await createSessionData()
                return { author }
            }

            it('should create discussion', async () => {
                const { author } = await setUp()

                await service().addComment(createCommentDto, author)

                const actual = await repository().findOne(discussionDto)
                expect(actual).toBeDefined()
            })
            it('should add comment to discussion', async () => {
                const { author } = await setUp()

                await service().addComment(createCommentDto, author)

                const actual = await repository().findOne({ where: discussionDto, relations: ['comments'] })

                expect(actual).toMatchObject({
                    comments: [expect.objectContaining({ content: createCommentDto.content })],
                })
            })
            it('should return comment', async () => {
                const { author } = await setUp()

                const actual = await service().addComment(createCommentDto, author)

                expect(actual).toBeInstanceOf(CommentEntity)
                expect(actual).toMatchObject({ content: createCommentDto.content })
            })
        })

        describe('when discussion exists', () => {
            const setUp = async () => {
                const { user: author } = await createSessionData()
                const discussion = await repository().save(repository().create(discussionDto))
                return { discussion, author }
            }

            it('should add comment to existing discussion', async () => {
                const { author, discussion } = await setUp()

                await service().addComment(createCommentDto, author)

                const actual = await repository().findOne(discussion.id, { relations: ['comments'] })

                expect(actual).toMatchObject({
                    comments: [expect.objectContaining({ content: createCommentDto.content })],
                })
            })
            it('should return comment', async () => {
                const { author, discussion } = await setUp()

                const actual = await service().addComment(createCommentDto, author)

                expect(actual).toBeInstanceOf(CommentEntity)
                expect(actual).toMatchObject({ content: createCommentDto.content, discussionId: discussion.id })
            })
        })

        describe('for different categories', () => {
            it('should create bounty discussion', async () => {
                const { user: author } = await createSessionData()
                const bountyDiscussionDto = {
                    category: DiscussionCategory.Bounty as const,
                    blockchainIndex: 1,
                    networkId: NETWORKS.POLKADOT,
                }

                await service().addComment(
                    {
                        content: 'content',
                        discussionDto: bountyDiscussionDto,
                    },
                    author,
                )

                const actual = await repository().findOne({ where: bountyDiscussionDto, relations: ['comments'] })
                expect(actual).toBeDefined()
            })

            it('should create proposal discussion', async () => {
                const { user: author } = await createSessionData()
                const proposalDiscussionDto = {
                    category: DiscussionCategory.Proposal as const,
                    blockchainIndex: 1,
                    networkId: NETWORKS.POLKADOT,
                }

                await service().addComment(
                    {
                        content: 'content',
                        discussionDto: proposalDiscussionDto,
                    },
                    author,
                )

                const actual = await repository().findOne({ where: proposalDiscussionDto, relations: ['comments'] })
                expect(actual).toBeDefined()
            })

            it('should create idea discussion', async () => {
                const { user: author } = await createSessionData()
                const ideaDiscussionDto = {
                    category: DiscussionCategory.Idea as const,
                    entityId: uuid(),
                }

                await service().addComment(
                    {
                        content: 'content',
                        discussionDto: ideaDiscussionDto,
                    },
                    author,
                )

                const actual = await repository().findOne({ where: ideaDiscussionDto, relations: ['comments'] })
                expect(actual).toBeDefined()
            })

            it('should create tip discussion', async () => {
                const { user: author } = await createSessionData()
                const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
                const tipDiscussionDto = {
                    category: DiscussionCategory.Tip as const,
                    blockchainHash: tipHash,
                    networkId: NETWORKS.POLKADOT,
                }

                await service().addComment(
                    {
                        content: 'content',
                        discussionDto: tipDiscussionDto,
                    },
                    author,
                )

                const actual = await repository().findOne({ where: tipDiscussionDto, relations: ['comments'] })
                expect(actual).toBeDefined()
            })
        })
    })
})
