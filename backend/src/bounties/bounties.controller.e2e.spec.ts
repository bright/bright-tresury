import { HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Keyring } from '@polkadot/api'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainsConnections } from '../blockchain/blockchain.module'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BountiesBlockchainService } from '../blockchain/bounties-blockchain.service'
import { getApi } from '../blockchain/utils'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { BountyEntity } from './entities/bounty.entity'

const baseUrl = `/api/v1/bounties/`

describe(`/api/v1/bounties/`, () => {
    const app = beforeSetupFullApp()

    const bountiesRepository = beforeAllSetup(() =>
        app().get<Repository<BountyEntity>>(getRepositoryToken(BountyEntity)),
    )
    const blockchainsConnections = beforeAllSetup(() => app().get<BlockchainsConnections>('PolkadotApi'))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('POST', () => {
        it(`should find extrinsic and create a bounty entity`, async (done) => {
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
                        value: '10',
                        title: 'title',
                        networkId: NETWORKS.POLKADOT,
                        proposer: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
                        extrinsicHash: extrinsic.hash,
                        lastBlockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    }),
                )
                .expect(HttpStatus.ACCEPTED)

            await extrinsic.send(async (result) => {
                if (result.isInBlock) {
                    const applyExtrinsicEvents = BlockchainService.getApplyExtrinsicEvents(result.events)
                    const bountyIndex = BountiesBlockchainService.extractBountyIndex(applyExtrinsicEvents)

                    // wait until the extrinsic is found, read and bounty is saved
                    setTimeout(async () => {
                        const bounty = (await bountiesRepository().findOne({ title: 'title' }))!
                        expect(bounty).toBeDefined()
                        expect(bounty.blockchainIndex).toBe(bountyIndex)
                        expect(bounty.value).toBe('10')
                        done()
                    }, 2000)
                }
            })
        })
    })
})
