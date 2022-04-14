import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    createWeb3SessionHandler,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { UserStatus } from '../users/entities/user-status'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { DiscussionsService } from './discussions.service'
import { BountyDiscussionDto } from './dto/discussion-category/bounty-discussion.dto'
import { IdeaDiscussionDto } from './dto/discussion-category/idea-discussion.dto'
import { ProposalDiscussionDto } from './dto/discussion-category/proposal-discussion.dto'
import { TipDiscussionDto } from './dto/discussion-category/tip-discussion.dto'
import { DiscussionDto } from './dto/discussion.dto'
import { DiscussionCategory } from './entites/discussion-category'
import { CommentsService } from './comments.service'
import { CommentReactionsService } from './reactions/comment-reactions.service'
import { ReactionType } from './reactions/entities/comment-reaction.entity'

const baseUrl = '/api/v1/comments'

describe('/api/v1/comments', () => {
    const app = beforeSetupFullApp()
    const discussionService = beforeAllSetup(() => app().get<DiscussionsService>(DiscussionsService))
    const commentsService = beforeAllSetup(() => app().get<CommentsService>(CommentsService))
    const reactionsService = beforeAllSetup(() => app().get<CommentReactionsService>(CommentReactionsService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())

        return { sessionHandler }
    }

    describe('GET', () => {
        const getSetUp = async (discussionDto: DiscussionDto) => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const comment = await discussionService().addComment(
                {
                    content: 'Some content',
                    discussionDto,
                },
                sessionHandler.sessionData.user,
            )
            return { comment, user: sessionHandler.sessionData.user }
        }

        it(`should return comments array`, async () => {
            const discussionDto: IdeaDiscussionDto = { category: DiscussionCategory.Idea, entityId: uuid() }
            const { comment } = await getSetUp(discussionDto)

            const result = await request(app()).get(
                `${baseUrl}?category=${discussionDto.category}&entityId=${discussionDto.entityId}`,
            )

            expect(result.body).toHaveLength(1)
            expect(result.body[0]).toStrictEqual({
                id: comment.id,
                content: comment.content,
                author: expect.objectContaining({
                    userId: comment.authorId,
                    status: UserStatus.EmailPasswordEnabled,
                    username: comment.author!.username,
                }),
                createdAt: comment.createdAt.getTime(),
                updatedAt: comment.updatedAt.getTime(),
                reactions: [],
            })
        })

        it(`should return reactions`, async () => {
            const discussionDto: IdeaDiscussionDto = { category: DiscussionCategory.Idea, entityId: uuid() }
            const { comment, user } = await getSetUp(discussionDto)
            const reaction = await reactionsService().create({ name: ReactionType.ThumbUp }, comment.id, user)

            const result = await request(app()).get(
                `${baseUrl}?category=${discussionDto.category}&entityId=${discussionDto.entityId}`,
            )

            expect(result.body[0]).toMatchObject({
                reactions: [
                    {
                        id: reaction.id,
                        name: reaction.name,
                        author: expect.objectContaining({
                            userId: comment.authorId,
                            status: UserStatus.EmailPasswordEnabled,
                            username: comment.author!.username,
                        }),
                    },
                ],
            })
        })

        it(`should return authors web3 address`, async () => {
            const sessionHandler = await createWeb3SessionHandler(app())
            const discussionDto: IdeaDiscussionDto = { category: DiscussionCategory.Idea, entityId: uuid() }
            const comment = await discussionService().addComment(
                {
                    content: 'Some content',
                    discussionDto,
                },
                sessionHandler.sessionData.user,
            )

            const result = await request(app()).get(
                `${baseUrl}?category=${discussionDto.category}&entityId=${discussionDto.entityId}`,
            )
            expect(result.body[0]).toMatchObject({
                author: expect.objectContaining({
                    web3address: sessionHandler.sessionData.user.web3Addresses![0].address,
                }),
            })
        })

        describe('for discussion category', () => {
            describe('idea', () => {
                const ideaBaseUrl = `${baseUrl}?category=${DiscussionCategory.Idea}&`

                it(`should return comments for uuid entityId`, async () => {
                    const discussionDto: IdeaDiscussionDto = { category: DiscussionCategory.Idea, entityId: uuid() }
                    await getSetUp(discussionDto)

                    const result = await request(app()).get(`${ideaBaseUrl}entityId=${discussionDto.entityId}`)

                    expect(result.body).toHaveLength(1)
                })

                it(`should return empty array for empty entityId`, async () => {
                    const result = await request(app()).get(ideaBaseUrl)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for not-uuid entityId`, async () => {
                    return request(app()).get(`${ideaBaseUrl}entityId=notUuid`).expect(HttpStatus.BAD_REQUEST)
                })
            })
            describe('bounty', () => {
                const baseBountyUrl = `${baseUrl}?category=${DiscussionCategory.Bounty}&`

                it(`should return comments for numeric blockchainIndex and existing networkId`, async () => {
                    const discussionDto: BountyDiscussionDto = {
                        category: DiscussionCategory.Bounty,
                        networkId: NETWORKS.POLKADOT,
                        blockchainIndex: 1,
                    }
                    await getSetUp(discussionDto)

                    const result = await request(app()).get(
                        `${baseBountyUrl}&blockchainIndex=1&networkId=${NETWORKS.POLKADOT}`,
                    )

                    expect(result.body).toHaveLength(1)
                })

                it(`should return empty array for empty blockchainIndex`, async () => {
                    const result = await request(app()).get(`${baseBountyUrl}&networkId=${NETWORKS.POLKADOT}`)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return empty array for empty networkId`, async () => {
                    const result = await request(app()).get(`${baseBountyUrl}&blockchainIndex=1`)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for not-numeric blockchainIndex`, async () => {
                    return request(app())
                        .get(`${baseBountyUrl}&networkId=${NETWORKS.POLKADOT}&blockchainIndex=aaa`)
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for unknown networkId`, async () => {
                    return request(app())
                        .get(`${baseBountyUrl}&networkId=unknown&blockchainIndex=1`)
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })

            describe('proposal', () => {
                const baseProposalUrl = `${baseUrl}?category=${DiscussionCategory.Proposal}`

                it(`should return comments for numeric blockchainIndex and existing networkId`, async () => {
                    const discussionDto: ProposalDiscussionDto = {
                        category: DiscussionCategory.Proposal,
                        networkId: NETWORKS.POLKADOT,
                        blockchainIndex: 1,
                    }
                    await getSetUp(discussionDto)

                    const result = await request(app()).get(
                        `${baseProposalUrl}&blockchainIndex=1&networkId=${NETWORKS.POLKADOT}`,
                    )

                    expect(result.body).toHaveLength(1)
                })

                it(`should return empty array for empty blockchainIndex`, async () => {
                    const result = await request(app()).get(`${baseProposalUrl}&networkId=${NETWORKS.POLKADOT}`)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return empty array for empty networkId`, async () => {
                    const result = await request(app()).get(`${baseProposalUrl}&blockchainIndex=1`)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for not-numeric blockchainIndex`, async () => {
                    return request(app())
                        .get(`${baseProposalUrl}&networkId=${NETWORKS.POLKADOT}&blockchainIndex=aaa`)
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for unknown networkId`, async () => {
                    return request(app())
                        .get(`${baseProposalUrl}&networkId=unknown&blockchainIndex=1`)
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })

            describe('tip', () => {
                const baseProposalUrl = `${baseUrl}?category=${DiscussionCategory.Tip}&`

                it(`should return comments for hash and existing networkId`, async () => {
                    const discussionDto: TipDiscussionDto = {
                        category: DiscussionCategory.Tip,
                        networkId: NETWORKS.POLKADOT,
                        blockchainHash: '0x0',
                    }
                    await getSetUp(discussionDto)

                    const result = await request(app()).get(
                        `${baseProposalUrl}&blockchainHash=0x0&networkId=${NETWORKS.POLKADOT}`,
                    )

                    expect(result.body).toHaveLength(1)
                })

                it(`should return empty array for empty blockchainHash`, async () => {
                    const result = await request(app()).get(`${baseProposalUrl}&networkId=${NETWORKS.POLKADOT}`)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return empty array for empty networkId`, async () => {
                    const result = await request(app()).get(`${baseProposalUrl}&blockchainHash=0x0`)
                    expect(result.body).toHaveLength(0)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for unknown networkId`, async () => {
                    return request(app())
                        .get(`${baseProposalUrl}&networkId=unknown&blockchainHash=0x0`)
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })
        })
    })

    describe('POST', () => {
        const validDto = {
            content: 'the content',
            discussionDto: {
                category: DiscussionCategory.Proposal,
                networkId: NETWORKS.POLKADOT,
                blockchainIndex: 1,
            },
        }
        it(`should return ${HttpStatus.CREATED}`, async () => {
            const { sessionHandler } = await setUp()

            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send(validDto))
                .expect(HttpStatus.CREATED)
        })

        it(`should return created comment`, async () => {
            const dto = {
                content: 'the content',
                discussionDto: {
                    category: DiscussionCategory.Proposal,
                    networkId: NETWORKS.POLKADOT,
                    blockchainIndex: 1,
                },
            }
            const { sessionHandler } = await setUp()

            const result = await sessionHandler.authorizeRequest(request(app()).post(baseUrl).send(dto))
            expect(result.body).toStrictEqual({
                id: expect.anything(),
                content: dto.content,
                author: expect.objectContaining({
                    userId: sessionHandler.sessionData.user.id,
                    status: UserStatus.EmailPasswordEnabled,
                    username: sessionHandler.sessionData.user.username,
                }),
                createdAt: expect.any(Number),
                updatedAt: expect.any(Number),
                reactions: [],
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for empty content`, async () => {
            const dto = {
                ...validDto,
                content: undefined,
            }
            const { sessionHandler } = await setUp()

            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send(dto))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            request(app()).post(baseUrl).send(validDto).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified email`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app())
            notVerifiedSessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send(validDto))
                .expect(HttpStatus.FORBIDDEN)
        })

        describe('for discussion category', () => {
            it(`should return ${HttpStatus.BAD_REQUEST} for unknown discussion category`, async () => {
                const dto = {
                    ...validDto,
                    discussionDto: {
                        category: 'unknown',
                    },
                }
                const { sessionHandler } = await setUp()

                return sessionHandler
                    .authorizeRequest(request(app()).post(baseUrl).send(dto))
                    .expect(HttpStatus.BAD_REQUEST)
            })

            describe('bounty', () => {
                const getBountyDiscussionDto = (dto: any = {}) => {
                    return {
                        ...validDto,
                        discussionDto: {
                            category: DiscussionCategory.Bounty,
                            blockchainIndex: 1,
                            networkId: NETWORKS.POLKADOT,
                            ...dto,
                        },
                    }
                }

                it(`should return ${HttpStatus.CREATED} for numeric blockchainIndex and existing networkId`, async () => {
                    const dto = getBountyDiscussionDto()
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.CREATED)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty blockchainIndex`, async () => {
                    const dto = getBountyDiscussionDto({ blockchainIndex: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for not number blockchainIndex`, async () => {
                    const dto = getBountyDiscussionDto({ blockchainIndex: 'a' })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty networkId`, async () => {
                    const dto = getBountyDiscussionDto({ networkId: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for unknown networkId`, async () => {
                    const dto = getBountyDiscussionDto({ networkId: 'unknown' })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })

            describe('proposal', () => {
                const getProposalDiscussionDto = (dto: any = {}) => {
                    return {
                        ...validDto,
                        discussionDto: {
                            category: DiscussionCategory.Proposal,
                            blockchainIndex: 1,
                            networkId: NETWORKS.POLKADOT,
                            ...dto,
                        },
                    }
                }

                it(`should return ${HttpStatus.CREATED} for numeric blockchainIndex and existing networkId`, async () => {
                    const dto = getProposalDiscussionDto()
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.CREATED)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty blockchainIndex`, async () => {
                    const dto = getProposalDiscussionDto({ blockchainIndex: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for not number blockchainIndex`, async () => {
                    const dto = getProposalDiscussionDto({ blockchainIndex: 'a' })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty networkId`, async () => {
                    const dto = getProposalDiscussionDto({ networkId: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for unknown networkId`, async () => {
                    const dto = getProposalDiscussionDto({ networkId: 'unknown' })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })
            describe('idea', () => {
                const getIdeaDiscussionDto = (dto: any = {}) => {
                    return {
                        ...validDto,
                        discussionDto: {
                            category: DiscussionCategory.Idea,
                            entityId: uuid(),
                            ...dto,
                        },
                    }
                }

                it(`should return ${HttpStatus.CREATED} for uuid entityId`, async () => {
                    const dto = getIdeaDiscussionDto()
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.CREATED)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty entityId`, async () => {
                    const dto = getIdeaDiscussionDto({ entityId: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for not uuid entityId`, async () => {
                    const dto = getIdeaDiscussionDto({ entityId: 'not a uuid' })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })

            describe('tip', () => {
                const getTipDiscussionDto = (dto: any = {}) => {
                    return {
                        ...validDto,
                        discussionDto: {
                            category: DiscussionCategory.Tip,
                            blockchainHash: '0x0',
                            networkId: NETWORKS.POLKADOT,
                            ...dto,
                        },
                    }
                }

                it(`should return ${HttpStatus.CREATED} for blockchainHash and existing networkId`, async () => {
                    const dto = getTipDiscussionDto()
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.CREATED)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty blockchainHash`, async () => {
                    const dto = getTipDiscussionDto({ blockchainHash: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for empty networkId`, async () => {
                    const dto = getTipDiscussionDto({ networkId: undefined })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })

                it(`should return ${HttpStatus.BAD_REQUEST} for unknown networkId`, async () => {
                    const dto = getTipDiscussionDto({ networkId: 'unknown' })
                    const { sessionHandler } = await setUp()

                    return sessionHandler
                        .authorizeRequest(request(app()).post(baseUrl).send(dto))
                        .expect(HttpStatus.BAD_REQUEST)
                })
            })
        })
    })

    describe('PATCH', () => {
        const patchSetUp = async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const discussionDto: IdeaDiscussionDto = { category: DiscussionCategory.Idea, entityId: uuid() }
            const comment = await discussionService().addComment(
                {
                    content: 'Some content',
                    discussionDto,
                },
                sessionHandler.sessionData.user,
            )
            return { sessionHandler, comment }
        }

        it(`should return ${HttpStatus.OK} for valid comment data`, async () => {
            const { sessionHandler, comment } = await patchSetUp()

            return sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}/${comment.id}`).send({ content: 'new content' }))
                .expect(HttpStatus.OK)
        })

        it(`should return updated comment for valid comment data`, async () => {
            const { sessionHandler, comment } = await patchSetUp()

            const result = await sessionHandler.authorizeRequest(
                request(app()).patch(`${baseUrl}/${comment.id}`).send({ content: 'new content' }),
            )
            expect(result.body).toStrictEqual({
                id: comment.id,
                content: 'new content',
                author: expect.objectContaining({
                    userId: sessionHandler.sessionData.user.id,
                    status: UserStatus.EmailPasswordEnabled,
                    username: sessionHandler.sessionData.user.username,
                }),
                createdAt: expect.any(Number),
                updatedAt: expect.any(Number),
                reactions: [],
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for empty content`, async () => {
            const { sessionHandler, comment } = await patchSetUp()

            return sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}/${comment.id}`).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            const { comment } = await patchSetUp()

            return request(app())
                .patch(`${baseUrl}/${comment.id}`)
                .send({ content: 'new content' })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const { comment } = await patchSetUp()
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notVerifiedSessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}/${comment.id}`).send({ content: 'new content' }))
                .expect(HttpStatus.FORBIDDEN)
        })
    })
    describe('DELETE', () => {
        const deleteSetUp = async () => {
            const { sessionHandler } = await setUp()
            const discussionDto: IdeaDiscussionDto = { category: DiscussionCategory.Idea, entityId: uuid() }
            const comment = await discussionService().addComment(
                {
                    content: 'Some content',
                    discussionDto,
                },
                sessionHandler.sessionData.user,
            )
            return { sessionHandler, comment }
        }

        it(`should return ${HttpStatus.OK}`, async () => {
            const { sessionHandler, comment } = await deleteSetUp()

            return sessionHandler
                .authorizeRequest(request(app()).delete(`${baseUrl}/${comment.id}`))
                .expect(HttpStatus.OK)
        })
        it(`should return ${HttpStatus.FORBIDDEN} when user not logged in`, async () => {
            const { comment } = await deleteSetUp()
            return request(app()).delete(`${baseUrl}/${comment.id}`).expect(HttpStatus.FORBIDDEN)
        })
        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const { comment } = await deleteSetUp()
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')

            return notVerifiedSessionHandler
                .authorizeRequest(request(app()).delete(`${baseUrl}/${comment.id}`))
                .expect(HttpStatus.FORBIDDEN)
        })
        it(`should call delete function in the service`, async () => {
            const { comment, sessionHandler } = await deleteSetUp()
            const spy = jest.spyOn(commentsService(), 'delete')

            await sessionHandler.authorizeRequest(request(app()).delete(`${baseUrl}/${comment.id}`))

            expect(spy).toHaveBeenCalledWith(
                comment.id,
                expect.objectContaining({
                    id: sessionHandler.sessionData.user.id,
                }),
            )
        })
    })
})
