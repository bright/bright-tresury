import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainService } from '../../../blockchain/blockchain.service'
import { createSessionData } from '../../../ideas/spec.helpers'
import { ProposalCommentsService } from '../../../proposals/proposal-comments/proposal-comments.service'
import { mockedBlockchainService, setUpProposalFromIdea } from '../../../proposals/spec.helpers'
import { Web3Address } from '../../../users/web3-addresses/web3-address.entity'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'

describe('New proposal comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getIdeaCommentsService = () => app.get().get(ProposalCommentsService)

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
        jest.spyOn(app().get(BlockchainService), 'listenForExtrinsic').mockImplementation(
            mockedBlockchainService.listenForExtrinsic,
        )
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    const setUp = async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        return setUpProposalFromIdea(app(), sessionHandler)
    }

    describe('after ProposalComment insert', () => {
        it('should create NewProposalComment event with data', async () => {
            const { proposal, idea } = await setUp()
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await getIdeaCommentsService().create(
                proposal.blockchainProposalId,
                proposal.networkId,
                user1.user,
                {
                    content: 'This is a comment',
                },
            )

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewProposalComment,
                    proposalBlockchainId: proposal.blockchainProposalId,
                    proposalTitle: proposal.details.title,
                    commentId: createdComment.comment.id,
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

            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user1.user, {
                content: 'This is a comment',
            })

            expect(spy).toHaveBeenCalledWith(expect.anything(), [idea.ownerId])
        })

        it('should create NewProposalComment event for proposer', async () => {
            const proposal = (await mockedBlockchainService.getProposals(NETWORKS.POLKADOT))[0]
            const proposer = await createSessionData({
                username: 'proposer',
                email: 'proposer@example.com',
                web3Addresses: [new Web3Address(proposal.proposer.address, true)],
            })
            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getIdeaCommentsService().create(proposal.proposalIndex, NETWORKS.POLKADOT, user1.user, {
                content: 'This is a comment',
            })

            expect(spy).toHaveBeenCalledWith(expect.anything(), [proposer.user.id])
        })

        it('should create NewProposalComment event for all proposal commenters', async () => {
            const { proposal } = await setUp()

            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user1.user, {
                content: 'This is a comment',
            })
            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user1.user, {
                content: 'This is a comment2',
            })

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user2.user, {
                content: 'This is a comment 3',
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })
            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user3.user, {
                content: 'This is a comment',
            })
            expect(spy).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.arrayContaining([user1.user.id, user2.user.id]),
            )
        })

        it('should create NewProposalComment event with idea owner NOT as receiver, when he is commenting', async () => {
            const { proposal, idea, sessionHandler: ideaOwner } = await setUp()
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getIdeaCommentsService().create(
                proposal.blockchainProposalId,
                proposal.networkId,
                ideaOwner.sessionData.user,
                {
                    content: 'This is a comment',
                },
            )
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([idea.ownerId]))
        })

        it('should create NewProposalComment event with proposer NOT as receiver, when he is commenting', async () => {
            const proposal = (await mockedBlockchainService.getProposals(NETWORKS.POLKADOT))[0]
            const proposer = await createSessionData({
                username: 'user1',
                email: 'user1@example.com',
                web3Addresses: [new Web3Address(proposal.proposer.address, true)],
            })
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getIdeaCommentsService().create(proposal.proposalIndex, NETWORKS.POLKADOT, proposer.user, {
                content: 'This is a comment',
            })

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([proposer]))
        })

        it('should not create NewIdeaComment event for the commenter', async () => {
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const { proposal } = await setUp()

            const user1 = await createSessionData({ username: 'user1', email: 'user1@example.com' })
            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user1.user, {
                content: 'This is a comment 1',
            })

            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })
            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user2.user, {
                content: 'This is a comment 2',
            })

            await getIdeaCommentsService().create(proposal.blockchainProposalId, proposal.networkId, user2.user, {
                content: 'This is a comment 3',
            })
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user2.user.id]))
        })
    })
})
