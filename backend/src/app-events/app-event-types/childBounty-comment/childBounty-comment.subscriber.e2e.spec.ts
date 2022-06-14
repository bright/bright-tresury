import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { createSessionData } from '../../../ideas/spec.helpers'
import { UserEntity } from '../../../users/entities/user.entity'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { CommentsService } from '../../../discussions/comments.service'
import { ChildBountiesService } from '../../../bounties/child-bounties/child-bounties.service'
import { ChildBountyDiscussionDto } from '../../../discussions/dto/discussion-category/child-bounty-discussion.dto'
import { CreateChildBountyDto } from '../../../bounties/child-bounties/dto/create-child-bounty.dto'
import {
    blockchainChildBountyCuratorProposed,
    mockGetChildBounties,
} from '../../../bounties/child-bounties/spec.helpers'
import { ListenForChildBountyDto } from '../../../bounties/child-bounties/dto/listen-for-child-bounty.dto'
import { createUserSessionHandlerWithVerifiedEmail } from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainChildBountiesService } from '../../../blockchain/blockchain-child-bounties/blockchain-child-bounties.service'
import { Web3AddressEntity } from '../../../users/web3-addresses/web3-address.entity'
import { NetworkPlanckValue } from '../../../utils/types'
import {
    BlockchainChildBountyDto,
    BlockchainChildBountyStatus,
} from '../../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'

describe('New child bounty comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getDiscussionsService = () => app.get().get(DiscussionsService)
    const getCommentsService = () => app.get().get(CommentsService)

    beforeAll(() => {
        mockGetChildBounties(app().get(BlockchainChildBountiesService))
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    const createChildBountyComment = (
        blockchainIndex: number,
        parentBountyBlockchainIndex: number,
        networkId: string,
        user: UserEntity,
        content: string = 'This is a child bounty comment',
    ) =>
        getDiscussionsService().addComment(
            {
                content,
                discussionDto: {
                    category: DiscussionCategory.ChildBounty,
                    parentBountyBlockchainIndex,
                    blockchainIndex,
                    networkId,
                } as ChildBountyDiscussionDto,
            },
            user,
        )

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const user = await createSessionData({ username: 'user1', email: 'user1@example.com' })

        const minimalValidCreateDto: ListenForChildBountyDto = {
            title: 'title',
            networkId: NETWORKS.POLKADOT,
            extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
            lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
        }

        const createChildBountyEntity = (
            service: ChildBountiesService,
            user: UserEntity,
            createDto: Partial<CreateChildBountyDto>,
        ) =>
            service.create(
                {
                    ...minimalValidCreateDto,
                    ...createDto,
                    blockchainIndex: createDto.blockchainIndex ?? 1,
                    parentBountyBlockchainIndex: createDto.parentBountyBlockchainIndex ?? 1,
                },
                user,
            )

        const childBountyEntity = await createChildBountyEntity(
            app().get(ChildBountiesService),
            sessionHandler.sessionData.user,
            {
                blockchainIndex: blockchainChildBountyCuratorProposed.index,
            },
        )

        const expectedChildBounty = new BlockchainChildBountyDto({
            index: childBountyEntity.blockchainIndex,
            parentIndex: childBountyEntity.blockchainIndex,
            description: childBountyEntity.description ?? '',
            value: '2' as NetworkPlanckValue,
            fee: '0.2' as NetworkPlanckValue,
            curator: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
            curatorDeposit: '0.2' as NetworkPlanckValue,
            beneficiary: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
            unlockAt: undefined,
            status: BlockchainChildBountyStatus.Added,
        })

        const createComment = (someUser: UserEntity) =>
            createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                someUser,
            )

        return {
            childBountyEntity,
            user,
            expectedChildBounty,
            createCommentForEntity: createComment,
            childBountyBlockchain: blockchainChildBountyCuratorProposed,
        }
    }

    describe('after ChildBountyComment insert', () => {
        it('should create NewChildBountyComment event with data', async () => {
            const { childBountyEntity, user } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewChildBountyComment,
                    childBountyBlockchainId: childBountyEntity.blockchainIndex,
                    bountyBlockchainId: childBountyEntity.parentBountyBlockchainIndex,
                    childBountyTitle: childBountyEntity.title,
                    commentId: createdComment.id,
                    commentsUrl: `http://localhost:3000/bounties/${childBountyEntity.parentBountyBlockchainIndex}/child-bounties/${childBountyEntity.blockchainIndex}/discussion?networkId=${childBountyEntity.networkId}`,
                    networkId: childBountyEntity.networkId,
                    websiteUrl: 'http://localhost:3000',
                },
                expect.anything(),
            )
        })

        it('should create NewChildBountyComment event for child bounty in-app owner', async () => {
            const { childBountyEntity, user } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(expect.anything(), [childBountyEntity.ownerId])
        })

        it('should create NewChildBountyComment event for curator', async () => {
            const { childBountyEntity, user } = await setUp()
            const curator = await createSessionData({
                username: 'curator',
                email: 'curator@example.com',
                web3Addresses: [new Web3AddressEntity(childBountyEntity.ownerId, true)],
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(
                expect.anything(),
                expect.arrayContaining([curator.user.web3Addresses![0].address]),
            )
        })

        it('should create NewChildBountyComment event for all child bounty commenters', async () => {
            const { childBountyEntity, user, createCommentForEntity } = await setUp()

            await createCommentForEntity(user.user)
            await createCommentForEntity(user.user)

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await createCommentForEntity(user2.user)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })
            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user3.user,
            )

            expect(spy).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.arrayContaining([user.user.id, user2.user.id]),
            )
        })

        it('should create NewChildBountyComment event for tagged users', async () => {
            const { childBountyEntity, user } = await setUp()
            const user2 = await createSessionData({
                username: 'user2',
                email: 'user2@example.com',
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
                `This is a comment with tag [@user2](${user2.user.id})`,
            )

            expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining([]))
        })

        it('should create TaggedInChildBountyComment event for update comment for all tagged users', async () => {
            const { childBountyEntity, user } = await setUp()
            const user2 = await createSessionData({
                username: 'user2',
                email: 'user2@example.com',
            })
            const comment = await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
                `This is a comment`,
            )

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getCommentsService().update(
                comment.id,
                { content: `This is a comment with tag [@user2](${user2.user.id})` },
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: AppEventType.TaggedInChildBountyComment,
                }),
                expect.arrayContaining([user2.user.id]),
            )
        })

        it('should create NewChildBountyComment event with curator NOT as receiver, when he is commenting', async () => {
            const { childBountyEntity, user } = await setUp()
            const curator = await createSessionData({
                username: 'curator',
                email: 'curator@example.com',
                web3Addresses: [new Web3AddressEntity(blockchainChildBountyCuratorProposed.curator!, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                curator.user,
            )

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([curator.user]))
        })

        it('should not create NewChildBountyComment event for the commenter', async () => {
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const { childBountyEntity, user } = await setUp()

            // create one comment
            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
            )

            // create another comment with the same user
            await createChildBountyComment(
                childBountyEntity.blockchainIndex,
                childBountyEntity.parentBountyBlockchainIndex,
                childBountyEntity.networkId,
                user.user,
            )
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user.user.id]))
        })
    })
})
