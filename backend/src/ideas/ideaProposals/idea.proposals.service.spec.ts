import {Test} from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BlockchainService} from '../../blockchain/blockchain.service';
import {UpdateExtrinsicDto} from '../../extrinsics/dto/updateExtrinsic.dto';
import {ExtrinsicEvent} from "../../extrinsics/extrinsicEvent";
import {getLogger} from "../../logging.module";
import {beforeAllSetup, cleanDatabase} from '../../utils/spec.helpers';
import {Idea} from '../idea.entity';
import {IdeaNetwork} from '../ideaNetwork.entity';
import {IdeasModule} from "../ideas.module";
import {IdeasService} from "../ideas.service";
import {createIdea} from "../spec.helpers";
import {CreateIdeaProposalDto, IdeaProposalDataDto} from "./dto/createIdeaProposal.dto";
import {IdeaProposalsService} from "./idea.proposals.service";
import {IdeaStatus} from "../ideaStatus";
import {EmptyBeneficiaryException} from "../exceptions/emptyBeneficiary.exception";

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

    const blockchainService = {
        listenForExtrinsic: (extrinsicHash: string, cb: (updateExtrinsicDto: UpdateExtrinsicDto) => void) => {
            cb(extrinsic)
        }
    }

    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [IdeasModule]
        })
            .overrideProvider(BlockchainService)
            .useValue(blockchainService)
            .compile()
    )

    const service = beforeAllSetup(() => module().get<IdeaProposalsService>(IdeaProposalsService))
    const ideasService = beforeAllSetup(() => module().get<IdeasService>(IdeasService))
    const ideaNetworkRepository = beforeAllSetup(() => module().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)))
    const ideaRepository = beforeAllSetup(() => module().get<Repository<Idea>>(getRepositoryToken(Idea)))

    beforeEach(async () => {
        await cleanDatabase()

        const partialIdea = {
            networks: [{name: 'local', value: 10}],
            beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        }
        const createdIdea = await createIdea(partialIdea, ideasService())
        idea = await ideasService().findOne(createdIdea.id)
        dto = new CreateIdeaProposalDto(idea.networks![0].id, '', '', new IdeaProposalDataDto(3))
        getLogger().info("Idea created")
        getLogger().info(idea)
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createProposal', () => {
        it('should assign extrinsic to idea network', async () => {
            await service().createProposal(idea.id, dto)
            const actual = await ideaNetworkRepository().findOne(idea.networks![0].id, {relations: ['extrinsic']})
            expect(actual!.extrinsic).toBeTruthy()
        })

        it('should run extractExtrinsic', async () => {
            const spy = jest.spyOn(service(), 'extractEvents').mockImplementationOnce(async (events: ExtrinsicEvent[], network: IdeaNetwork) => {
                getLogger().info("This is a mocked extractEvents function")
                return
            })
            await service().createProposal(idea.id, dto)

            expect(spy).toHaveBeenCalled()
        })

        it('should throw empty beneficiary exception if idea beneficiary is empty', async () => {
            const createdIdea = await ideasService().create({title: '', networks: [{name: 'local', value: 10}]})
            const actualIdea = (await ideasService().findOne(createdIdea.id))!
            const actualDto = new CreateIdeaProposalDto(actualIdea.networks![0].id, '', '', new IdeaProposalDataDto(3))
            await expect(service().createProposal(actualIdea.id, actualDto))
                .rejects
                .toThrow(EmptyBeneficiaryException)
        })
    })

    describe('extractExtrinsic', () => {
        it('should assign blockchainProposalId to idea network', async () => {
            await service().extractEvents(extrinsic.events, idea.networks![0])

            const i = await ideaNetworkRepository()
            const actual = await i.findOne(idea.networks![0].id)
            expect(actual!.blockchainProposalId).toBe(proposalIndex)
        })
        it(`should change idea status to turned into proposal`, async () => {
            await service().extractEvents(extrinsic.events, idea.networks![0])

            const repository = await ideaRepository()
            const actualIdea = await repository.findOne(idea.id)
            expect(actualIdea!.status).toBe(IdeaStatus.TurnedIntoProposal)
        })
    })
});
