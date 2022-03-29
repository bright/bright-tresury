import { Test } from '@nestjs/testing'
import { Keyring, SubmittableResult } from '@polkadot/api'
import ApiPromise from '@polkadot/api/promise'
import { KeyringPair } from '@polkadot/keyring/types'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { beforeAllSetup, NETWORKS } from '../utils/spec.helpers'
import { BlockchainModule, BlockchainsConnections } from './blockchain.module'
import BN from 'bn.js'
import { BlockchainService } from './blockchain.service'
import { MotionTimeType } from './dto/motion-time.dto'
import { BN_TEN, getApi } from './utils'
import { ApiTypes } from '@polkadot/api/types'
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types'
import { EventRecord } from '@polkadot/types/interfaces'

describe(`Blockchain service`, () => {
    // TODO fix types!
    // @ts-ignore
    let api: ApiPromise
    let keyring: Keyring
    let aliceKeypair: KeyringPair
    const aliceAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
    const bobAddress = '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3'
    const module = beforeAllSetup(
        async () =>
            await Test.createTestingModule({
                imports: [BlockchainModule],
            }).compile(),
    )

    const service = beforeAllSetup(() => module().get<BlockchainService>(BlockchainService))
    const blockchainsConnections = beforeAllSetup(() => module().get<BlockchainsConnections>('PolkadotApi'))

    beforeEach(async () => {
        api = getApi(blockchainsConnections(), NETWORKS.POLKADOT)
        keyring = new Keyring({ type: 'sr25519' })
        aliceKeypair = keyring.addFromUri('//Alice', { name: 'Alice default' })
    })

    describe('findExtrinsic', () => {
        it('should start listening and find proposeSpend extrinsic with events', async (done) => {
            // FIXME: if this starts to fail please examine race condition between extrinsicSendPromise and service().listenForExtrinsic
            // create and sign extrinsic
            const extrinsic = api.tx.treasury.proposeSpend(10, bobAddress)
            await extrinsic.signAsync(aliceKeypair)
            const extrinsicSendPromise = new Promise((resolve, reject) =>
                extrinsic.send((result: SubmittableResult) =>
                    result.isError ? reject(result) : result.isCompleted ? resolve(result) : undefined,
                ),
            )
            const findTreasuryProposedEvent = (events: EventRecord[]) =>
                events.find(({ event: { section, method } }) => section === 'treasury' && method === 'Proposed')
            // start listening for the extrinsic
            await service().listenForExtrinsic(
                NETWORKS.POLKADOT,
                extrinsic.hash.toString(),
                async (result: UpdateExtrinsicDto) => {
                    const submittableResult = (await extrinsicSendPromise) as SubmittableResult
                    const treasuryProposedEvent = findTreasuryProposedEvent(submittableResult.events)
                    const expectedProposalId = Number(treasuryProposedEvent?.event.data[0])

                    expect(result).toBeDefined()
                    expect(result!.events).toContainEqual({
                        section: 'treasury',
                        method: 'Proposed',
                        data: [
                            {
                                name: 'u32',
                                value: `${expectedProposalId}`,
                            },
                        ],
                    })
                    expect(result!.events).toContainEqual({
                        section: 'balances',
                        method: 'Reserved',
                        data: [
                            {
                                name: 'AccountId32',
                                value: aliceAddress,
                            },
                            {
                                name: 'u128',
                                value: '1000000000000',
                            },
                        ],
                    })
                    expect(result!.data).toStrictEqual({
                        value: 10,
                        beneficiary: {
                            id: bobAddress,
                        },
                    })
                    done()
                },
            )
        }, 60000)

        it('should start listening and find successful extrinsic with exceptions', async (done) => {
            // FIXME: if this starts to fail please examine race condition between extrinsicSendPromise and service().listenForExtrinsic
            // create and sign extrinsic which will fail as only ApproveOrigin can call this extrinsic
            const extrinsic = api.tx.treasury.rejectProposal(0)
            await extrinsic.signAsync(aliceKeypair)

            const extrinsicSendPromise = new Promise((resolve, reject) =>
                extrinsic.send((result: SubmittableResult) =>
                    result.isError ? reject(result) : result.isCompleted ? resolve(result) : undefined,
                ),
            )
            // start listening for the extrinsic
            await service().listenForExtrinsic(
                NETWORKS.POLKADOT,
                extrinsic.hash.toString(),
                async (result: UpdateExtrinsicDto) => {
                    const submittableResult = (await extrinsicSendPromise) as SubmittableResult
                    const expectedBlockHash = submittableResult.status.asInBlock.toString()
                    expect(result).toBeDefined()
                    expect(result!.blockHash).toBe(expectedBlockHash)
                    const errorEvent = result!.events.find(
                        (e) => e.section === 'system' && e.method === 'ExtrinsicFailed',
                    )
                    expect(errorEvent).toBeDefined()
                    expect(errorEvent!.data).toContainEqual(
                        expect.objectContaining({
                            value: 'BadOrigin',
                        }),
                    )
                    done()
                },
            )
        }, 60000)
    })

    const signAndSend = (
        extrinsic: SubmittableExtrinsic<ApiTypes>,
        keyringPair: KeyringPair,
    ): Promise<SubmittableResult> =>
        new Promise((resolve, reject) =>
            extrinsic.signAndSend(keyringPair, (result: SubmittableResult) =>
                result.isError ? reject(result) : result.isCompleted ? resolve(result) : undefined,
            ),
        )

    const randomString = (): string => Math.random().toString(36).substring(7)

    describe('getIdentities', () => {
        it('should return Alice identity', async () => {
            const displayRaw = randomString()
            const extrinsic = api.tx.identity.setIdentity({ display: { Raw: displayRaw } })
            await signAndSend(extrinsic, aliceKeypair)
            const identities = await service().getIdentities(NETWORKS.POLKADOT, [aliceAddress])
            expect(identities.get(aliceAddress)?.display).toBe(displayRaw)
        }, 60000)
        it('should not fail when no identity in blockchain', async () => {
            const identities = await service().getIdentities(NETWORKS.POLKADOT, [bobAddress])
            const bobIdentity = identities.get(bobAddress)
            expect(bobIdentity).toBeDefined()
            expect(bobIdentity!.display).toBeUndefined()
        }, 60000)
    })
    describe('getRemainingTime', () => {
        it('should correctly calculate remaining time', async () => {
            const currentBlockNumber = await api.derive.chain.bestNumber()
            const futureBlockNumber = currentBlockNumber.add(new BN(1))
            const remainingTime = service().getRemainingTime(NETWORKS.POLKADOT, currentBlockNumber, futureBlockNumber)

            expect(remainingTime.type).toBe(MotionTimeType.Future)
            expect(remainingTime.blockNo).toBe(futureBlockNumber.toNumber())
            expect(remainingTime.blocksCount).toBe(1)
            expect(remainingTime.time.seconds).toBe(6) // assuming that time for one block is 6 seconds
        }, 60000)
    })
    describe('getProposals', () => {
        it('should return existing proposals', async () => {
            // create a proposal
            const proposalValue = BN_TEN.pow(new BN(14))
            const nextProposalIndex = (await api.query.treasury.proposalCount()).toNumber()
            const extrinsic = api.tx.treasury.proposeSpend(proposalValue, bobAddress)
            await signAndSend(extrinsic, aliceKeypair)
            const proposals = await service().getProposals(NETWORKS.POLKADOT)
            expect(proposals.length).toBeGreaterThan(0)
            const lastProposal = proposals.find((p) => p.proposalIndex === nextProposalIndex)!
            expect(lastProposal.proposalIndex).toBe(nextProposalIndex)
            expect(lastProposal.proposer).toBe(aliceAddress)
            expect(lastProposal.beneficiary).toBe(bobAddress)
            expect(lastProposal.bond).toBe(proposalValue.muln(5).divn(100).toString()) // 5% of proposalValue
            expect(lastProposal.value).toBe(proposalValue.toString())
        }, 60000)
    })
    describe('getStats', () => {
        it('should call getProposalsCount method', async () => {
            const getProposalsCountSpy = jest.spyOn(service(), 'getProposalsCount')
            await service().getStats(NETWORKS.POLKADOT)
            expect(getProposalsCountSpy).toHaveBeenCalled()
        }, 60000)
        it('should call getSpendPeriodCalculations method', async () => {
            const getSpendPeriodCalculationsSpy = jest.spyOn(service(), 'getSpendPeriodCalculations')
            await service().getStats(NETWORKS.POLKADOT)
            expect(getSpendPeriodCalculationsSpy).toHaveBeenCalled()
        }, 60000)
        it('should call getBudget method', async () => {
            const getBudgetSpy = jest.spyOn(service(), 'getBudget')
            await service().getStats(NETWORKS.POLKADOT)
            expect(getBudgetSpy).toHaveBeenCalled()
        }, 60000)
    })
    describe('getProposalsCount', () => {
        it('should return number of proposals submitted, approved and rejected', async () => {
            const { submitted, approved, rejected } = await service().getProposalsCount(NETWORKS.KUSAMA)
            expect(typeof submitted).toBe('number')
            expect(typeof approved).toBe('number')
            expect(typeof rejected).toBe('number')
        }, 60000)
    })
    describe('getSpendPeriodCalculations', () => {
        it('should return spendPeriod, timeLeft and leftOfSpendingPeriod', async () => {
            const { spendPeriod, timeLeft, leftOfSpendingPeriod } = await service().getSpendPeriodCalculations(
                NETWORKS.KUSAMA,
            )
            expect(typeof spendPeriod).toBe('object')
            expect(typeof timeLeft).toBe('object')
            expect(typeof leftOfSpendingPeriod).toBe('number')
        }, 60000)
    })
    describe('getBudget', () => {
        it('should return availableBalance, nextFoundsBurn', async () => {
            const { availableBalance, nextFoundsBurn } = await service().getBudget(NETWORKS.KUSAMA)
            expect(typeof availableBalance).toBe('string')
            expect(typeof nextFoundsBurn).toBe('string')
        }, 60000)
    })
})
