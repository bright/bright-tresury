import { EntityRepository, Repository } from 'typeorm'
import { IdeaMilestone } from './entities/idea-milestone.entity'

@EntityRepository(IdeaMilestone)
export class IdeaMilestonesRepository extends Repository<IdeaMilestone> {}
