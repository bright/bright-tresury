import {ForbiddenException, UnauthorizedException} from "@nestjs/common";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SessionUser} from "../../auth/session/session.decorator";
import {cleanAuthorizationDatabase} from "../../auth/supertokens/specHelpers/supertokens.database.spec.helper";
import {BlockchainService} from '../../blockchain/blockchain.service';
import {UpdateExtrinsicDto} from '../../extrinsics/dto/updateExtrinsic.dto';
import {ExtrinsicEvent} from "../../extrinsics/extrinsicEvent";
import {beforeAllSetup, beforeSetupFullApp, cleanDatabase} from '../../utils/spec.helpers';
import {EmptyBeneficiaryException} from "../exceptions/emptyBeneficiary.exception";
import {Idea} from '../entities/idea.entity';
import {IdeaNetwork} from '../entities/ideaNetwork.entity';
import {IdeasService} from "../ideas.service";
import {IdeaStatus} from "../ideaStatus";
import {createIdea, createSessionUser} from "../spec.helpers";
import {CreateIdeaProposalDto, IdeaProposalDataDto} from "./dto/createIdeaProposal.dto";
import {IdeaProposalsService} from "./idea.proposals.service";

describe('IdeaProposalsService', () => {
    const blockHash = '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04'
    const proposalIndex = 3
    const extrinsic = {
        blockHash,
        events: [{
            section: 'treasury',
            method: 'Proposed',
            data: [{
                name: 'ProposalIndex',
                value: proposalIndex.toString()
            }]
        }
        ]
    } as UpdateExtrinsicDto

    let idea: Idea
    let dto: CreateIdeaProposalDto
    let sessionUser: SessionUser

    const app = beforeSetupFullApp()
    const blockchainService = beforeAllSetup(() => app().get<BlockchainService>(BlockchainService))
    const service = beforeAllSetup(() => app().get<IdeaProposalsService>(IdeaProposalsService))
    const ideasService = beforeAllSetup(() => app().get<IdeasService>(IdeasService))
    const ideaNetworkRepository = beforeAllSetup(() => app().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)))
    const ideaRepository = beforeAllSetup(() => app().get<Repository<Idea>>(getRepositoryToken(Idea)))

    beforeAll(() => {
        jest.spyOn(blockchainService(), 'listenForExtrinsic').mockImplementation(
            async (extrinsicHash: string, cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>) => {
                await cb(extrinsic)
            })
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        const partialIdea = {
            networks: [{name: 'local', value: 10}],
            beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        }
        sessionUser = await createSessionUser()
        const createdIdea = await createIdea(partialIdea, sessionUser, ideasService())
        idea = await ideasService().findOne(createdIdea.id, sessionUser)
        dto = new CreateIdeaProposalDto(idea.networks![0].id, '', '', new IdeaProposalDataDto(3))
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createProposal', () => {
        it('should assign extrinsic to idea network', async (done) => {
            await service().createProposal(idea.id, dto, sessionUser)
            setTimeout(async () => {
                const actual = await ideaNetworkRepository().findOne(idea.networks![0].id, {relations: ['extrinsic']})
                expect(actual!.extrinsic).toBeTruthy()
                done()
            }, 4000)
        })

        it('should run extractExtrinsic', async (done) => {
            const spy = jest.spyOn(service(), 'extractEvents').mockImplementationOnce(async (events: ExtrinsicEvent[], network: IdeaNetwork) => {
                return
            })
            await service().createProposal(idea.id, dto, sessionUser)
            setTimeout(async () => {
                expect(spy).toHaveBeenCalled()
                done()
            }, 4000)
        })

        it('should throw empty beneficiary exception if idea beneficiary is empty', async () => {
            const createdIdea = await ideasService().create({title: '', networks: [{name: 'local', value: 10}]}, sessionUser)
            const actualIdea = (await ideasService().findOne(createdIdea.id, sessionUser))!
            const actualDto = new CreateIdeaProposalDto(actualIdea.networks![0].id, '', '', new IdeaProposalDataDto(3))
            await expect(service().createProposal(actualIdea.id, actualDto, sessionUser))
                .rejects
                .toThrow(EmptyBeneficiaryException)
        })

        it('should throw forbidden exception when creating proposal from not own idea', async () => {
            const otherSessionUser = await createSessionUser({username: 'other', email: 'other@example.com'})
            await expect(service().createProposal(idea.id, dto, otherSessionUser))
                .rejects
                .toThrow(ForbiddenException)
        })
    })

    describe('extractExtrinsic', () => {
        it('should assign blockchainProposalId to idea network', async () => {
            await service().extractEvents(extrinsic.events, idea.networks![0], sessionUser)
            const i = await ideaNetworkRepository()
            const actual = await i.findOne(idea.networks![0].id)
            expect(actual!.blockchainProposalId).toBe(proposalIndex)
        })
        it(`should change idea status to turned into proposal`, async () => {
            await service().extractEvents(extrinsic.events, idea.networks![0], sessionUser)
            const repository = await ideaRepository()
            const actualIdea = await repository.findOne(idea.id)
            expect(actualIdea!.status).toBe(IdeaStatus.TurnedIntoProposal)
        })
    })
});
