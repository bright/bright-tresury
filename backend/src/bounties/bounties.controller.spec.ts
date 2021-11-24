import { HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { BlockchainService } from '../blockchain/blockchain.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { NetworkPlanckValue } from '../utils/types'
import { BountiesService } from './bounties.service'
import { BountyDto } from './dto/bounty.dto'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { BountyEntity } from './entities/bounty.entity'
import {
    blockchainBounty0,
    blockchainBountyPendingPayout,
    createBountyEntity,
    minimalValidCreateDto,
    mockGetBounties,
    mockListenForExtrinsic,
} from './spec.helpers'

const baseUrl = `/api/v1/bounties/`

describe(`/api/v1/bounties/`, () => {
    const app = beforeSetupFullApp()

    const bountiesService = beforeAllSetup(() => app().get<BountiesService>(BountiesService))
    const bountiesRepository = beforeAllSetup(() =>
        app().get<Repository<BountyEntity>>(getRepositoryToken(BountyEntity)),
    )
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const blockchainBountiesService = beforeAllSetup(() =>
        app().get<BlockchainBountiesService>(BlockchainBountiesService),
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    beforeAll(() => {
        mockListenForExtrinsic(blockchainService())
        mockGetBounties(blockchainBountiesService())
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('POST', () => {
        const minimalValidDto: CreateBountyDto = {
            blockchainDescription: 'bc-description',
            value: '10' as NetworkPlanckValue,
            title: 'title',
            networkId: NETWORKS.POLKADOT,
            proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
            extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
            lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
        }

        const setUp = async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return { sessionHandler }
        }

        it(`should return ${HttpStatus.ACCEPTED} for minimal valid data`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl).send({
                        blockchainDescription: 'bc-description',
                        value: '10',
                        title: 'title',
                        networkId: NETWORKS.POLKADOT,
                        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                        extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
                        lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    }),
                )
                .expect(HttpStatus.ACCEPTED)
        })

        it('should return extrinsic with data', async () => {
            const { sessionHandler } = await setUp()
            const data = {
                blockchainDescription: 'bc-description',
                value: '10',
                title: 'title',
                field: 'optimisation',
                description: 'description',
                networkId: NETWORKS.POLKADOT,
                proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
                lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
            }
            const { body } = await sessionHandler.authorizeRequest(request(app()).post(baseUrl).send(data))
            expect(body.lastBlockHash).toBe('0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04')
            expect(body.extrinsicHash).toBe('0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41')
            expect(body.data).toStrictEqual(data)
        })

        it(`should call listenForProposeBountyExtrinsic method of bounties service`, async () => {
            const { sessionHandler } = await setUp()
            const spy = jest.spyOn(bountiesService(), 'listenForProposeBountyExtrinsic')
            await sessionHandler.authorizeRequest(request(app()).post(baseUrl).send(minimalValidDto))
            expect(spy).toHaveBeenCalledWith(
                minimalValidDto,
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no blockchain description`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            blockchainDescription: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no value`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            value: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no title`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            title: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no extrinsicHash`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            extrinsicHash: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no lastBlockHash`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            lastBlockHash: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no proposer`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            proposer: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            networkId: undefined,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            ...minimalValidDto,
                            networkId: 'not_valid',
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app()).post(baseUrl).send(minimalValidDto).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app())

            return notVerifiedUserSessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send(minimalValidDto))
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('PATCH /:bountyIndex', () => {
        const setUp = async (blockchainBounty: BlockchainBountyDto = blockchainBounty0) => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const bountyEntity = await createBountyEntity(bountiesService(), sessionHandler.sessionData.user, {
                blockchainIndex: blockchainBounty.index,
            })
            return { sessionHandler, bountyEntity }
        }

        it('should return updated bounty', async () => {
            const { sessionHandler } = await setUp(blockchainBounty0)

            const { body } = await sessionHandler.authorizeRequest(
                request(app()).patch(`${baseUrl}0?network=${NETWORKS.POLKADOT}`).send({
                    title: 'new title',
                    field: 'new field',
                    description: 'new description',
                    beneficiary: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                }),
            )

            expect(body.blockchainIndex).toBe(0)
            expect(body.title).toBe('new title')
            expect(body.field).toBe('new field')
            expect(body.description).toBe('new description')
            expect(body.beneficiary.address).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
        })

        it(`should call update method of bounties service`, async () => {
            const { sessionHandler, bountyEntity } = await setUp(blockchainBounty0)
            const spy = jest.spyOn(bountiesService(), 'update')
            await sessionHandler.authorizeRequest(
                request(app()).patch(`${baseUrl}0?network=${NETWORKS.POLKADOT}`).send({
                    title: 'new title',
                    field: 'new field',
                    description: 'new description',
                    beneficiary: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                }),
            )
            expect(spy).toHaveBeenCalledWith(
                0,
                NETWORKS.POLKADOT,
                {
                    title: 'new title',
                    field: 'new field',
                    description: 'new description',
                    beneficiary: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                },
                expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} status code for not valid beneficiary address`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}0?network=${NETWORKS.POLKADOT}`)
                        .send({ beneficiary: 'not-valid-address' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} status code for bounty id not being a number`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}AB?network=${NETWORKS.POLKADOT}`).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} status code for non existing network id`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}0?network=non-existing`).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} status code for no network id`, async () => {
            const { sessionHandler } = await setUp()
            return sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}0`).send({}))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .patch(`${baseUrl}0?network=${NETWORKS.POLKADOT}`)
                .send({})
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedUserSessionHandler = await createUserSessionHandler(app())

            return notVerifiedUserSessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}0?network=${NETWORKS.POLKADOT}`).send({}))
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('GET', () => {
        it('should return current bounties', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await bountiesRepository().save(
                bountiesRepository().create({
                    blockchainDescription: 'bc-description-1',
                    value: '1',
                    title: 'bounty-title',
                    field: 'field',
                    description: 'db-description',
                    networkId: NETWORKS.POLKADOT,
                    proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                    blockchainIndex: 0,
                    owner: sessionHandler.sessionData.user,
                }),
            )

            const bountiesDtos: BountyDto[] = (await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)).body
            expect(Array.isArray(bountiesDtos)).toBe(true)
            expect(bountiesDtos).toHaveLength(7)

            const bountyDto = bountiesDtos.find(({ blockchainIndex }) => blockchainIndex === 0)!
            expect(bountyDto).toBeDefined()
            expect(bountyDto.blockchainIndex).toBe(0)
            expect(bountyDto.blockchainDescription).toBe('bc-description-1')
            expect(bountyDto.proposer.address).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(bountyDto.value).toBe('10000')
            expect(bountyDto.curatorFee).toBe('100')
            expect(bountyDto.curatorDeposit).toBe('0')
            expect(bountyDto.bond).toBe('10')
            expect(bountyDto.status).toBe(BlockchainBountyStatus.Proposed)
            expect(bountyDto.ownerId).toBe(sessionHandler.sessionData.user.id)
            expect(bountyDto.title).toBe('bounty-title')
            expect(bountyDto.field).toBe('field')
            expect(bountyDto.description).toBe('db-description')
        })
        it('should return only bounties that are in blockchain', async () => {
            await bountiesRepository().save(
                bountiesRepository().create({
                    blockchainDescription: 'bc-description-entity',
                    value: '1',
                    title: 'bounty-entity-title',
                    field: 'field',
                    description: 'db-description',
                    networkId: NETWORKS.POLKADOT,
                    proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                    blockchainIndex: 100,
                }),
            )
            const bountiesDtos: BountyDto[] = (await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)).body

            const bountyDto = bountiesDtos.find(({ blockchainIndex }) => blockchainIndex === 100)
            expect(bountyDto).toBeUndefined()
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for no networkId`, async () => {
            return request(app()).get(baseUrl).expect(HttpStatus.BAD_REQUEST)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId`, async () => {
            return request(app()).get(`${baseUrl}?network=non-existing`).expect(HttpStatus.BAD_REQUEST)
        })
    })
    describe('GET /:bountyIndex', () => {
        it('should return correct bounty', async () => {
            const { body: bountyDto } = await request(app()).get(`${baseUrl}0?network=${NETWORKS.POLKADOT}`)
            expect(bountyDto.blockchainIndex).toBe(0)
            expect(bountyDto.blockchainDescription).toBe('bc-description-1')
            expect(bountyDto.proposer.address).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(bountyDto.value).toBe('10000')
            expect(bountyDto.curatorFee).toBe('100')
            expect(bountyDto.curatorDeposit).toBe('0')
            expect(bountyDto.bond).toBe('10')
            expect(bountyDto.status).toBe(BlockchainBountyStatus.Proposed)
            expect(bountyDto.ownerId).toBeUndefined()
            expect(bountyDto.title).toBeUndefined()
            expect(bountyDto.field).toBeUndefined()
            expect(bountyDto.description).toBeUndefined()
        })
        it('should return blockchain beneficiary if both available', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await bountiesRepository().save(
                bountiesRepository().create({
                    ...minimalValidCreateDto,
                    blockchainIndex: blockchainBountyPendingPayout.index,
                    owner: sessionHandler.sessionData.user,
                    beneficiary: 'other-than-in-blockchain',
                }),
            )

            const { body } = await request(app()).get(
                `${baseUrl}${blockchainBountyPendingPayout.index}?network=${NETWORKS.POLKADOT}`,
            )

            expect(body.beneficiary.address).toEqual(blockchainBountyPendingPayout.beneficiary?.address)
        })
        it('should return entity beneficiary if no blockchain', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const bountyEntity = await bountiesRepository().save(
                bountiesRepository().create({
                    ...minimalValidCreateDto,
                    blockchainIndex: blockchainBounty0.index,
                    owner: sessionHandler.sessionData.user,
                    beneficiary: 'other-than-in-blockchain',
                }),
            )

            const { body } = await request(app()).get(
                `${baseUrl}${blockchainBounty0.index}?network=${NETWORKS.POLKADOT}`,
            )

            expect(body.beneficiary.address).toEqual(bountyEntity.beneficiary)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} status code for bounty id not being a number`, async () => {
            return request(app()).get(`${baseUrl}AB?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.BAD_REQUEST)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} status code for non existing network id`, async () => {
            return request(app()).get(`${baseUrl}0?network=non-existing`).expect(HttpStatus.BAD_REQUEST)
        })
        it(`should return ${HttpStatus.BAD_REQUEST} status code for no network id`, async () => {
            return request(app()).get(`${baseUrl}0`).expect(HttpStatus.BAD_REQUEST)
        })
    })
})
