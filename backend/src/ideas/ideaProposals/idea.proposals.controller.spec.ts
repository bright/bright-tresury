import {v4 as uuid} from "uuid";
import {BlockchainService} from "../../blockchain/blockchain.service";
import {UpdateExtrinsicDto} from "../../extrinsics/dto/updateExtrinsic.dto";
import {beforeAllSetup, beforeSetupFullApp, cleanDatabase, request} from '../../utils/spec.helpers';
import {Idea} from "../entities/idea.entity";
import {createIdea, createSessionUser} from '../spec.helpers';

const baseUrl = (id: string) => `/api/v1/ideas/${id}/proposals`

describe(`/api/v1/ideas/:id/proposals`, () => {
    const app = beforeSetupFullApp()
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))

    let idea: Idea
    const data = {
        ideaNetworkId: '',
        extrinsicHash: '0x9bcdab6b6f5a0c4a4f17174fe80af7c8f58dd0aecc20fc49d6abee0522787a41',
        lastBlockHash: '0x74a566a72b3fdb19b766e2a8cfbee63388e56fb58edd48bce71e6177325ef13f',
        data: {
            nextProposalId: 5,
        }
    }

    beforeAll(() => {
        jest.spyOn(blockchainService(), 'listenForExtrinsic').mockImplementation(
            async (extrinsicHash: string, cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>) => {
                await cb({
                    blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
                    events: [{
                        section: 'treasury',
                        method: 'Proposed',
                        data: [{
                            name: 'ProposalIndex',
                            value: "3"
                        }]
                    }
                    ],
                    data: {
                        value: 10,
                        beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
                    }
                })
            })
    })

    beforeEach(async () => {
        await cleanDatabase()
        const user = await createSessionUser()
        idea = await createIdea({
            beneficiary: uuid(),
            networks: [{name: 'local', value: 2}]
        }, user)
        data.ideaNetworkId = idea.networks![0].id
    })

    describe('POST', () => {
        it('should return 202', () => {
            return request(app())
                .post(baseUrl(idea.id))
                .send(data)
                .expect(202)
        })

        it('should return network with created extrinsic', async () => {
            const result = await request(app())
                .post(baseUrl(idea.id))
                .send(data)

            expect(result.body.name).toBe('local')
            expect(result.body.extrinsic).toBeDefined()
            expect(result.body.extrinsic.extrinsicHash).toBe(data.extrinsicHash)
            expect(result.body.extrinsic.lastBlockHash).toBe(data.lastBlockHash)
            expect(result.body.extrinsic.data).toStrictEqual(data.data)
        })

        it('should return 404 for not existing idea', () => {
            return request(app())
                .post(baseUrl(uuid()))
                .send(data)
                .expect(404)
        })

        it('should return 404 for not existing idea network', () => {
            return request(app())
                .post(baseUrl(idea.id))
                .send({ ...data, ideaNetworkId: uuid() })
                .expect(404)
        })

    })
})
