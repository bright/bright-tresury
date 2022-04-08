import { NetworkPlanckValue } from '../util/types'
import { PublicUserDto } from '../util/publicUser.dto'
import { Nil } from '../../../backend/src/utils/types'

export interface TipDto {
    hash: string
    reason: Nil<string>
    finder: PublicUserDto
    beneficiary: PublicUserDto
    tips: {
        tipper: PublicUserDto
        value: NetworkPlanckValue
    }[]
    tippersCount: number

    title: Nil<string>
    description: Nil<string>
    owner: Nil<PublicUserDto>

    polkassembly?: Nil<{ title: string }>
}
