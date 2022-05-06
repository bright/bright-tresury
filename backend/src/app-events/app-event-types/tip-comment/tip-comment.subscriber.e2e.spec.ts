import { AppEventsService } from '../../app-events.service'
import { AppEventType } from '../../entities/app-event-type'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../../utils/spec.helpers'
import { UserEntity } from '../../../users/entities/user.entity'
import { DiscussionCategory } from '../../../discussions/entites/discussion-category'
import { cleanAuthorizationDatabase } from '../../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { DiscussionsService } from '../../../discussions/discussions.service'
import { TipDiscussionDto } from '../../../discussions/dto/discussion-category/tip-discussion.dto'
import { TipEntity } from '../../../tips/tip.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { createSessionData, createWeb3SessionData } from '../../../ideas/spec.helpers'
import { aliceAddress, bobAddress, charlieAddress, daveAddress, validBlockchainTip } from '../../../tips/spec.helpers'
import { BlockchainTipDto } from '../../../blockchain/blockchain-tips/dto/blockchain-tip.dto'
import { NetworkPlanckValue } from '../../../utils/types'
import { BlockchainTipsService } from '../../../blockchain/blockchain-tips/blockchain-tips.service'
import { Web3AddressEntity } from '../../../users/web3-addresses/web3-address.entity'
import { CommentsService } from '../../../discussions/comments.service'

describe('New tip comment app event e2e', () => {
    const app = beforeSetupFullApp()
    const getDiscussionsService = () => app.get().get(DiscussionsService)
    const getCommentsService = () => app.get().get(CommentsService)
    const blockchainTipService = beforeAllSetup(() => app().get<BlockchainTipsService>(BlockchainTipsService))
    const tipsRepository = beforeAllSetup(() => app().get<Repository<TipEntity>>(getRepositoryToken(TipEntity)))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.clearAllMocks()
    })

    const createTipComment = (
        blockchainHash: string,
        networkId: string,
        user: UserEntity,
        content: string = 'This is a comment',
    ) =>
        getDiscussionsService().addComment(
            {
                content,
                discussionDto: {
                    category: DiscussionCategory.Tip,
                    blockchainHash,
                    networkId,
                } as TipDiscussionDto,
            },
            user,
        )

    const setUpEntityTip = (tip: Partial<TipEntity>, user: UserEntity) => {
        return tipsRepository().save(
            tipsRepository().create({
                networkId: NETWORKS.POLKADOT,
                blockchainHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                title: 'entity title',
                description: 'entity description',
                owner: user,
                ...tip,
            }),
        )
    }

    const expectedBlockchainTip = new BlockchainTipDto({
        ...validBlockchainTip,
        who: bobAddress,
        finder: charlieAddress,
        tips: [{ tipper: daveAddress, value: '1' as NetworkPlanckValue }],
        findersFee: false,
    })

    const setUpBlockchainTip = (tip: Partial<BlockchainTipDto>) => {
        jest.spyOn(blockchainTipService(), 'getTip').mockImplementation(
            async () =>
                new BlockchainTipDto({
                    hash: tip.hash ?? `0x${tip.hash}`,
                    reason: tip.reason,
                    who: tip.who ?? bobAddress,
                    finder: tip.finder ?? charlieAddress,
                    deposit: tip.deposit ?? ('1' as NetworkPlanckValue),
                    closes: tip.closes ?? null,
                    tips: tip.tips ?? [],
                    findersFee: tip.findersFee ?? false,
                }),
        )
    }

    describe('after TipComment insert', () => {
        it('should create NewTipComment event with data', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            const createdComment = await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)

            expect(spy).toHaveBeenCalledWith(
                {
                    type: AppEventType.NewTipComment,
                    tipHash: tipEntity.blockchainHash,
                    tipTitle: tipEntity.title,
                    commentId: createdComment.id,
                    commentsUrl: `http://localhost:3000/tips/${tipEntity.blockchainHash}/discussion?networkId=${tipEntity.networkId}`,
                    networkId: tipEntity.networkId,
                    websiteUrl: 'http://localhost:3000',
                },
                expect.anything(),
            )
        })

        it('should create NewTipComment event for finder', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            const finder = await createSessionData({
                username: 'finder',
                email: 'finder@example.com',
                web3Addresses: [new Web3AddressEntity(validBlockchainTip.finder, true)],
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)

            expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining([finder.user.id]))
        })

        it('should create NewBountyComment event for beneficiary', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            const beneficiary = await createSessionData({
                username: 'beneficiary',
                email: 'beneficiary@example.com',
                web3Addresses: [new Web3AddressEntity(validBlockchainTip.who, true)],
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)

            expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining([beneficiary.user.id]))
        })

        it('should create NewTipComment event for all tip commenters', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const user2 = await createSessionData({ username: 'user2', email: 'user2@example.com' })

            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)
            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)
            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user2.user)

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const user3 = await createSessionData({ username: 'user3', email: 'user3@example.com' })

            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user3.user)

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.arrayContaining([user.id, user2.user.id]))
        })

        it('should create NewTipComment event for tagged users', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const user2 = await createSessionData({
                username: 'user2',
                email: 'user2@example.com',
            })
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            await createTipComment(
                tipEntity.blockchainHash,
                tipEntity.networkId,
                user,
                `This is a comment with tag [@user2](${user2.user.id})`,
            )

            expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining([]))
        })

        it('should create TaggedInTipComment event for update comment for all tagged users', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const user2 = await createSessionData({
                username: 'user2',
                email: 'user2@example.com',
            })
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)
            const comment = await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await getCommentsService().update(
                comment.id,
                { content: `This is a comment with tag [@user2](${user2.user.id})` },
                user,
            )

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: AppEventType.TaggedInTipComment,
                }),
                expect.arrayContaining([user2.user.id]),
            )
        })

        it('should create NewTipComment event with tip finder NOT as receiver, when he is commenting', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            const finder = await createSessionData({
                username: 'finder',
                email: 'finder@example.com',
                web3Addresses: [new Web3AddressEntity(validBlockchainTip.finder, true)],
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, finder.user)

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([finder.user.id]))
        })

        it('should create NewTipComment event with beneficiary NOT as receiver, when he is commenting', async () => {
            const { user } = await createWeb3SessionData(aliceAddress)
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            const beneficiary = await createSessionData({
                username: 'beneficiary',
                email: 'beneficiary@example.com',
                web3Addresses: [new Web3AddressEntity(validBlockchainTip.who, true)],
            })

            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')

            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, beneficiary.user)

            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([beneficiary.user.id]))
        })

        it('should not create NewTipComment event for the commenter', async () => {
            const spy = jest.spyOn(app().get<AppEventsService>(AppEventsService), 'create')
            const { user } = await createWeb3SessionData(aliceAddress)
            const tipHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
            const tipEntity = await setUpEntityTip({ blockchainHash: tipHash }, user)
            setUpBlockchainTip(expectedBlockchainTip)

            // create one comment
            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)

            // create another comment with the same user
            await createTipComment(tipEntity.blockchainHash, tipEntity.networkId, user)
            expect(spy).toHaveBeenLastCalledWith(expect.anything(), expect.not.arrayContaining([user.id]))
        })
    })
})
