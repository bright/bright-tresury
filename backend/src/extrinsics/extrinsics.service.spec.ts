import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { beforeAllSetup, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { CreateExtrinsicDto } from './dto/createExtrinsic.dto'
import { UpdateExtrinsicDto } from './dto/updateExtrinsic.dto'
import { Extrinsic, ExtrinsicStatuses } from './extrinsic.entity'
import { ExtrinsicsModule } from './extrinsics.module'
import { ExtrinsicsService } from './extrinsics.service'

describe('ExtrinsicsService', () => {
    const blockchainService = {
        listenForExtrinsic: (
            networkId: string,
            extrinsicDto: CreateExtrinsicDto,
            cb: (updateExtrinsicDto: UpdateExtrinsicDto) => {},
        ) => {
            cb({
                blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                events: [
                    {
                        section: 'treasury',
                        method: 'Proposed',
                        data: [
                            {
                                name: 'ProposalIndex',
                                value: '3',
                            },
                        ],
                    },
                ],
                data: {
                    value: 10,
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
            })
        },
    }

    const createExtrinsicDto = {
        extrinsicHash: '0xeec6225d744ac4840ff761aa0f5cb8c680d78299435a4ebd67d3849ed587b2c1',
        lastBlockHash: '0x8d152599c9e65cc7195b483d3158b832fdcd3738ee88fe809dff80227f2c2e43',
        data: { someField: 'some value' },
    }

    const module = beforeAllSetup(
        async () =>
            await Test.createTestingModule({
                imports: [ExtrinsicsModule],
            })
                .overrideProvider(BlockchainService)
                .useValue(blockchainService)
                .compile(),
    )
    const blockchainConfig: any = beforeAllSetup(() => module().resolve(BlockchainService))

    const service = beforeAllSetup(() => module().get<ExtrinsicsService>(ExtrinsicsService))
    const repository = beforeAllSetup(() => module().get<Repository<Extrinsic>>(getRepositoryToken(Extrinsic)))

    beforeEach(async () => {
        await cleanDatabase()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findByExtrinsicHash', () => {
        const extrinsic = new Extrinsic(
            '0xeec6225d744ac4840ff761aa0f5cb8c680d78299435a4ebd67d3849ed587b2c1',
            '0x8d152599c9e65cc7195b483d3158b832fdcd3738ee88fe809dff80227f2c2e43',
        )

        it('should return existing extrinsic', async () => {
            await repository().save(extrinsic)

            const actual = await service().findByExtrinsicHash(extrinsic.extrinsicHash)
            expect(actual).toBeDefined()
            expect(actual!.lastBlockHash).toBe(extrinsic.lastBlockHash)
            expect(actual!.data).toStrictEqual({})
        })

        it('should return undefined for not existing extrinsic', async () => {
            const actual = await service().findByExtrinsicHash(extrinsic.extrinsicHash)
            expect(actual).toBeUndefined()
        })
    })

    describe('create', () => {
        it('should save extrinsic with minimal data', async () => {
            await service().create(createExtrinsicDto)

            const actual = await repository().findOne({
                extrinsicHash: '0xeec6225d744ac4840ff761aa0f5cb8c680d78299435a4ebd67d3849ed587b2c1',
            })
            expect(actual).toBeDefined()
            expect(actual!.lastBlockHash).toBe(createExtrinsicDto.lastBlockHash)
            expect(actual!.data).toStrictEqual(createExtrinsicDto.data)
        })
    })

    describe('update', () => {
        it('should update extrinsic with events', async () => {
            const ex = await service().create(createExtrinsicDto)
            const updateExtrinsicDto = {
                blockHash: '0xeec6225d744ac4840ff761aa0f5cb8c680d78299435a4ebd67d3849ed587b2c1',
                events: [
                    {
                        section: 'balances',
                        method: 'transfer',
                        data: [
                            {
                                name: 'value',
                                value: '10',
                            },
                        ],
                    },
                ],
            } as UpdateExtrinsicDto

            await service().update(ex.id, updateExtrinsicDto)

            const actual = await repository().findOne(ex.id)
            expect(actual).toBeDefined()
            expect(actual!.blockHash).toBe(updateExtrinsicDto.blockHash)
            expect(actual!.events).toStrictEqual(updateExtrinsicDto.events)
            expect(actual!.status).toEqual(ExtrinsicStatuses.ExtrinsicSuccess)
        })

        // todo check exceptions in blockchain and write proper tests
        // it('should update extrinsic with exceptions', async () => {
        //
        // })
    })

    describe('listenForProposalExtrinsic', () => {
        it('should run create extrinsic', async () => {
            const spy = jest.spyOn(service(), 'create')

            await service().listenForExtrinsic(NETWORKS.POLKADOT, createExtrinsicDto)
            expect(spy).toHaveBeenCalled()
        })

        it('should return created extrinsic', async () => {
            const actual = await service().listenForExtrinsic(NETWORKS.POLKADOT, createExtrinsicDto)
            expect(actual).toBeDefined()
            expect(actual.extrinsicHash).toBe(createExtrinsicDto.extrinsicHash)
            expect(actual.lastBlockHash).toBe(createExtrinsicDto.lastBlockHash)
            expect(actual.data).toStrictEqual(createExtrinsicDto.data)
        })

        it('should run blockchain service listener', async () => {
            const spy = jest.spyOn(blockchainService, 'listenForExtrinsic')

            await service().listenForExtrinsic(NETWORKS.POLKADOT, createExtrinsicDto)
            expect(spy).toHaveBeenCalled()
        })

        it('should run update extrinsic if extrinsic found', async () => {
            const spy = jest.spyOn(service(), 'update')

            await service().listenForExtrinsic(NETWORKS.POLKADOT, createExtrinsicDto)
            expect(spy).toHaveBeenCalled()
        })
    })
})
