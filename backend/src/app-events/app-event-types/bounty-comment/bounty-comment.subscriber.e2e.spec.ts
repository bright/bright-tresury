import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainBountiesService } from '../../../blockchain/blockchain-bounties/blockchain-bounties.service'
import { BountiesService } from '../../../bounties/bounties.service'
import { BountyCommentsService } from '../../../bounties/bounty-comments/bounty-comments.service'
import { blockchainBountyCuratorProposed, createBountyEntity, mockGetBounties } from '../../../bounties/spec.helpers'
import { createSessionData } from '../../../ideas/spec.helpers'
import { UserEntity } from '../../../users/entities/user.entity'
import { Web3AddressEntity } from '../../../users/web3-addresses/web3-address.entity'
import { beforeSetupFullApp, cleanDatabase } from '../../../utils/spec.helpers'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'

describe('New bounty comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getBountyCommentsService = () => app.get().get(BountyCommentsService)

    beforeAll(() => {
        mockGetBounties(app().get(BlockchainBountiesService))
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const user = await createSessionData({ username: 'user1', email: 'user1@example.com' })
        const bountyEntity = await createBountyEntity(app().get(BountiesService), sessionHandler.sessionData.user, {
            blockchainIndex: blockchainBountyCuratorProposed.index,
        })

        const createComment = (someUser: UserEntity) =>
            getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                { content: 'This is a comment' },
                someUser,
            )

        return {
            sessionHandler,
            commentDto: { content: 'This is a comment' },
            user,
            bountyEntity,
            bountyBlockchain: blockchainBountyCuratorProposed,
            createComment,
        }
    }

    describe('after BountyComment insert', () => {
        it('should create NewBountyComment event with data', async () => {
            const { bountyEntity, user, commentDto } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewBountyComment,
                    bountyBlockchainId: bountyEntity.blockchainIndex,
                    bountyTitle: bountyEntity.title,
                    commentId: createdComment.comment.id,
                    commentsUrl: `http://localhost:3000/bounties/${bountyEntity.blockchainIndex}/discussion?networkId=${bountyEntity.networkId}`,
                    networkId: bountyEntity.networkId,
                    websiteUrl: 'http://localhost:3000',
                },
                expect.anything(),
            )
        })

        it('should create NewBountyComment event for bounty in-app owner', async () => {
            const { bountyEntity, user, commentDto } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(expect.anything(), [bountyEntity.ownerId])
        })

        it('should create NewBountyComment event for proposer', async () => {
            const { bountyEntity, bountyBlockchain, user, commentDto } = await setUp()
            const proposer = await createSessionData({
                username: 'proposer',
                email: 'proposer@example.com',
                web3Addresses: [new Web3AddressEntity(bountyBlockchain.proposer.address, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining([proposer.user.id]))
        })

        it('should create NewBountyComment event for curator', async () => {
            const { bountyEntity, bountyBlockchain, user, commentDto } = await setUp()
            const curator = await createSessionData({
                username: 'curator',
                email: 'curator@example.com',
                web3Addresses: [new Web3AddressEntity(bountyBlockchain.curator!.address, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user.user,
            )

            expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining([curator.user.id]))
        })

        it('should create NewBountyComment event for all bounty commenters', async () => {
            const { bountyEntity, user, createComment, commentDto } = await setUp()

            await createComment(user.user)
            await createComment(user.user)

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await createComment(user2.user)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })
            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user3.user,
            )
            expect(spy).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.arrayContaining([user.user.id, user2.user.id]),
            )
        })

        it('should create NewBountyComment event with bounty owner NOT as receiver, when he is commenting', async () => {
            const { bountyEntity, sessionHandler: bountyOwner, commentDto } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                bountyOwner.sessionData.user,
            )
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([bountyEntity.ownerId]))
        })

        it('should create NewBountyComment event with proposer NOT as receiver, when he is commenting', async () => {
            const { bountyEntity, bountyBlockchain, commentDto } = await setUp()
            const proposer = await createSessionData({
                username: 'proposer',
                email: 'proposer@example.com',
                web3Addresses: [new Web3AddressEntity(bountyBlockchain.proposer.address, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                proposer.user,
            )

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([proposer.user]))
        })

        it('should create NewBountyComment event with curator NOT as receiver, when he is commenting', async () => {
            const { bountyEntity, bountyBlockchain, commentDto } = await setUp()
            const curator = await createSessionData({
                username: 'curator',
                email: 'curator@example.com',
                web3Addresses: [new Web3AddressEntity(bountyBlockchain.curator!.address, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                curator.user,
            )

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([curator.user]))
        })

        it('should not create NewBountyComment event for the commenter', async () => {
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const { bountyEntity, user, commentDto } = await setUp()

            // create one comment
            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user.user,
            )

            // create another comment with the same user
            await getBountyCommentsService().create(
                bountyEntity.blockchainIndex,
                bountyEntity.networkId,
                commentDto,
                user.user,
            )
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user.user.id]))
        })
    })
})
