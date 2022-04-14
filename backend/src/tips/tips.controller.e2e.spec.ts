import { HttpStatus } from '@nestjs/common'
import { Keyring } from '@polkadot/api'
import { ISubmittableResult } from '@polkadot/types/types/extrinsic'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainTipsService } from '../blockchain/blockchain-tips/blockchain-tips.service'
import { BlockchainsConnections } from '../blockchain/blockchain.module'
import { BlockchainService } from '../blockchain/blockchain.service'
import { getApi } from '../blockchain/utils'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'

const baseUrl = `/api/v1/tips/`
const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

describe(`/api/v1/tips/`, () => {
    const app = beforeSetupFullApp()

    const blockchainsConnections = beforeAllSetup(() => app().get<BlockchainsConnections>('PolkadotApi'))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('create a tip (POST) and fetch all tips (GET)', () => {
        it(`should find extrinsic and create a tip entity`, async () => {
            const api = getApi(blockchainsConnections(), NETWORKS.POLKADOT)
            const keyring = new Keyring({ type: 'sr25519' })
            const aliceKeypair = keyring.addFromUri('//Alice', { name: 'Alice default' })
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())

            // create extrinsic
            const extrinsic = api.tx.tips.reportAwesome('bc', bobAddress)
            await extrinsic.signAsync(aliceKeypair)

            // POST
            await sessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl).send({
                        blockchainReason: 'bc',
                        title: 'title',
                        networkId: NETWORKS.POLKADOT,
                        beneficiary: bobAddress,
                        finder: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                        extrinsicHash: extrinsic.hash,
                        lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    }),
                )
                .expect(HttpStatus.ACCEPTED)

            // send exstrinsic and extract tip hash
            const inBlockResult: ISubmittableResult = await new Promise((resolve) => {
                extrinsic.send(async (result) => {
                    if (result.isInBlock) {
                        resolve(result)
                    }
                })
            })
            const applyExtrinsicEvents = BlockchainService.getApplyExtrinsicEvents(inBlockResult.events)
            const tipHash = BlockchainTipsService.extractTipHash(applyExtrinsicEvents)

            await new Promise((resolve) => setTimeout(resolve, 600))

            // GET
            const response = await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)

            expect(response.body.items).toContainEqual(
                expect.objectContaining({
                    hash: tipHash,
                    owner: expect.objectContaining({
                        userId: sessionHandler.sessionData.user.id,
                    }),
                    title: 'title',
                }),
            )
        })
    })
})
