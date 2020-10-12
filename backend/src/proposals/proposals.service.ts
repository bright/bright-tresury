import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from './proposal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>
  ) {}

  findAll(): Promise<Proposal[]> {
    return this.proposalRepository.find()
  }

  save(proposal: Proposal): Promise<Proposal> {
    return this.proposalRepository.save(proposal)
  }
}
