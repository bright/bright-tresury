import { IdeaEntity } from '../entities/idea.entity'
import { PublicUserDto } from '../../users/dto/public-user.dto'
import { Nil } from '../../utils/types'

export default interface FindIdeaDto {
    entity: IdeaEntity
    beneficiary?: Nil<PublicUserDto>
}
