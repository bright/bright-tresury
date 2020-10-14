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
            const proposalIds = proposalNetworks.map(pc => pc.proposal.id)
            where.id = In(proposalIds)
        }

        return this.proposalRepository.find({
            relations: ["networks"],
            where
        })
    }

    async save(proposal: Proposal, networks?: string[]): Promise<Proposal> {
        const p = await this.proposalRepository.save(proposal)
        if (networks) {
            networks.forEach(async (network) => {
                await this.proposalNetworkRepository.save(new ProposalNetwork(network, p))
            })
        }
        return p
    }
}
