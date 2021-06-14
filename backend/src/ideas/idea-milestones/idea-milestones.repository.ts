import { EntityRepository, Repository } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { SaveOptions } from 'typeorm/repository/SaveOptions'
import { IdeaMilestone } from './entities/idea-milestone.entity'

@EntityRepository(IdeaMilestone)
export class IdeaMilestonesRepository extends Repository<IdeaMilestone> {
    async save<T extends DeepPartial<IdeaMilestone>>(entity: T, options?: SaveOptions): Promise<T & IdeaMilestone> {
        const existing = await this.findOne(entity.id)
        if (!existing) {
            const lastOrdinalNumber = await this.createQueryBuilder('idea_milestones')
                .where({ ideaId: entity.idea?.id })
                .select('max(idea_milestones.ordinalNumber)', 'value')
                .getRawOne()

            const nextOrdinalNumber = (lastOrdinalNumber.value ?? 0) + 1
            entity.ordinalNumber = nextOrdinalNumber
        }
        return super.save(entity, options)
    }
}
