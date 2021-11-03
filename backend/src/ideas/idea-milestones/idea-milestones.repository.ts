import { EntityRepository, Repository } from 'typeorm'
import { IdeaMilestoneEntity } from './entities/idea-milestone.entity'

@EntityRepository(IdeaMilestoneEntity)
export class IdeaMilestonesRepository extends Repository<IdeaMilestoneEntity> {}
