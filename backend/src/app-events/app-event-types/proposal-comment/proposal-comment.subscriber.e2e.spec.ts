import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { ProposalDiscussionDto } from '../../../discussions/dto/discussion-category/proposal-discussion.dto'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { createSessionData } from '../../../ideas/spec.helpers'
import {
    mockedBlockchainService,
    mockGetProposalAndGetProposals,
    mockListenForExtrinsic,
    setUpProposalFromIdea,
} from '../../../proposals/spec.helpers'
import { UserEntity } from '../../../users/entities/user.entity'
import { Web3AddressEntity } from '../../../users/web3-addresses/web3-address.entity'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'

describe('New proposal comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getDiscussionsService = () => app.get().get(DiscussionsService)

    beforeAll(() => {
        mockGetProposalAndGetProposals(app().get(BlockchainService))
        mockListenForExtrinsic(app().get(BlockchainService))
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    const createProposalComment = (
        blockchainIndex: number,
        networkId: string,
        user: UserEntity,
        content: string = 'This is a comment',
    ) =>
        getDiscussionsService().addComment(
            {
                content,
                discussionDto: {
                    category: DiscussionCategory.Proposal,
                    blockchainIndex,
                    networkId,
                } as ProposalDiscussionDto,
            },
            user,
        )

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        return setUpProposalFromIdea(app(), sessionHandler)
    }

    describe('after ProposalComment insert', () => {
        it('should create NewProposalComment event with data', async () => {
            const { proposal, idea } = await setUp()
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await createProposalComment(
                proposal.blockchainProposalId,
                proposal.networkId,
                user1.user,
            )

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewProposalComment,
                    proposalBlockchainId: proposal.blockchainProposalId,
                    proposalTitle: proposal.details.title,
                    commentId: createdComment.id,
                    commentsUrl: `http://localhost:3000/proposals/${proposal.blockchainProposalId}/discussion?networkId=${proposal.networkId}`,
                    networkId: proposal.networkId,
                    websiteUrl: 'http://localhost:3000',
                },
                expect.anything(),
            )
        })

        it('should create NewProposalComment event for idea owner', async () => {
            const { proposal, idea } = await setUp()
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user1.user)

            expect(spy).toHaveBeenCalledWith(expect.anything(), [idea.ownerId])
        })

        it('should create NewProposalComment event for proposer', async () => {
            const proposal = (await mockedBlockchainService.getProposals(NETWORKS.POLKADOT))[0]
            const proposer = await createSessionData({
                username: 'proposer',
                email: 'proposer@example.com',
                web3Addresses: [new Web3AddressEntity(proposal.proposer.address, true)],
            })
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createProposalComment(proposal.proposalIndex, NETWORKS.POLKADOT, user1.user)

            expect(spy).toHaveBeenCalledWith(expect.anything(), [proposer.user.id])
        })

        it('should create NewProposalComment event for all proposal commenters', async () => {
            const { proposal } = await setUp()

            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user1.user)
            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user1.user)

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user2.user)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })
            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user3.user)
            expect(spy).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.arrayContaining([user1.user.id, user2.user.id]),
            )
        })

        it('should create NewProposalComment event with idea owner NOT as receiver, when he is commenting', async () => {
            const { proposal, idea, sessionHandler: ideaOwner } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, ideaOwner.sessionData.user)
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([idea.ownerId]))
        })

        it('should create NewProposalComment event with proposer NOT as receiver, when he is commenting', async () => {
            const proposal = (await mockedBlockchainService.getProposals(NETWORKS.POLKADOT))[0]
            const proposer = await createSessionData({
                username: 'user1',
                email: 'user1@example.com',
                web3Addresses: [new Web3AddressEntity(proposal.proposer.address, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createProposalComment(proposal.proposalIndex, NETWORKS.POLKADOT, proposer.user)

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([proposer.user]))
        })

        it('should not create NewProposalComment event for the commenter', async () => {
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const { proposal } = await setUp()

            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user1.user)

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user2.user)

            await createProposalComment(proposal.blockchainProposalId, proposal.networkId, user2.user)
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user2.user.id]))
        })
    })
})
