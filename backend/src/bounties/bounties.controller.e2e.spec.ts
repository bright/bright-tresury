import { HttpStatus } from '@nestjs/common'
import { Keyring } from '@polkadot/api'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainBountiesService } from '../blockchain/blockchain-bounties/blockchain-bounties.service'
import { BlockchainsConnections } from '../blockchain/blockchain.module'
import { BlockchainService } from '../blockchain/blockchain.service'
import { getApi } from '../blockchain/utils'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { BountyDto } from './dto/bounty.dto'
import { ISubmittableResult } from '@polkadot/types/types/extrinsic'

const baseUrl = `/api/v1/bounties/`

describe(`/api/v1/bounties/`, () => {
    const app = beforeSetupFullApp()

    const blockchainsConnections = beforeAllSetup(() => app().get<BlockchainsConnections>('PolkadotApi'))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('create a bounty (POST) and fetch all bounties (GET)', () => {
        it(`should find extrinsic and create a bounty entity`, async () => {
            const api = getApi(blockchainsConnections(), NETWORKS.POLKADOT)
            const keyring = new Keyring({ type: 'sr25519' })
            const aliceKeypair = keyring.addFromUri('//Alice', { name: 'Alice default' })

            const extrinsic = api.tx.bounties.proposeBounty(1000000000000, 'bc')
            await extrinsic.signAsync(aliceKeypair)

            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await sessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl).send({
                        blockchainDescription: 'bc-description',
                        value: '1000000000000',
                        title: 'title',
                        networkId: NETWORKS.POLKADOT,
                        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                        extrinsicHash: extrinsic.hash,
                        lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    }),
                )
                .expect(HttpStatus.ACCEPTED)

            const inBlockResult: ISubmittableResult = await new Promise((resolve, reject) => {
                extrinsic.send(async (result) => {
                    if (result.isInBlock) {
                        resolve(result)
                    }
                })
            })
            const applyExtrinsicEvents = BlockchainService.getApplyExtrinsicEvents(inBlockResult.events)
            const bountyIndex = BlockchainBountiesService.extractBountyIndex(applyExtrinsicEvents)
            await new Promise((resolve) => setTimeout(resolve, 400))
            const response = await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)
            const { items: bountiesDtos }: { items: BountyDto[] } = response.body
            const bountyDto = bountiesDtos.find(({ blockchainIndex }) => blockchainIndex === bountyIndex)!
            expect(bountyDto).toBeDefined()
            expect(bountyDto.proposer.address).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5')
            expect(bountyDto.value).toBe('1000000000000')
            expect(bountyDto.bond).toBe('10200000000')
            expect(bountyDto.status).toBe('Proposed')
            expect(bountyDto.title).toBe('title')
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}${bountyIndex}?network=${NETWORKS.POLKADOT}`)
                        .send({ title: 'new title' }),
                )
                .expect(HttpStatus.OK)

            // GET single
            const { body: singleBounty } = await request(app()).get(
                `${baseUrl}${bountyIndex}?network=${NETWORKS.POLKADOT}`,
            )
            expect(singleBounty).toBeDefined()
            expect(singleBounty.title).toBe('new title')
        })
    })
})
