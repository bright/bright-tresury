import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, In, Repository } from 'typeorm';
import { Proposal } from './proposal.entity';
import { ProposalNetwork } from './proposalNetwork.entity';

@Injectable()
export class ProposalsService {
    constructor(
        @InjectRepository(Proposal)
        private readonly proposalRepository: Repository<Proposal>,
        @InjectRepository(ProposalNetwork)
        private readonly proposalNetworkRepository: Repository<ProposalNetwork>
    ) { }

    async find(networkName?: string): Promise<Proposal[]> {
        const where: FindConditions<Proposal> = {}

        if (networkName) {
            const proposalNetworks = await this.proposalNetworkRepository.find({
                relations: ['proposal'],
                where: {
                    name: networkName
                }
            })
            if (proposalNetworks.length === 0) {
                return []
            }
            const proposalIds = proposalNetworks.map(pc => pc.proposal.id)
            where.id = In(proposalIds)
        }

        return this.proposalRepository.find({
            relations: ['networks'],
            where
        })
    }

    findOne(id: string): Promise<Proposal | undefined> {
        return this.proposalRepository.findOne(id, { relations: ['networks'] })
    }

    async save(createProposalDto: CreateProposalDto): Promise<Proposal> {
        const proposal = await this.proposalRepository.save(new Proposal(createProposalDto.title))
        if (createProposalDto.networks) {
            await Promise.all(createProposalDto.networks.map(async (network) => {
                await this.proposalNetworkRepository.save(new ProposalNetwork(network, proposal))
            }))
        }
        const result = await this.findOne(proposal.id)
        return result ?? proposal
    }
}
