import { NetworkPlanckValue, Nil } from '../util/types'
import { PublicUserDto } from '../util/publicUser.dto'

export interface TipDto {
    hash: string
    reason: Nil<string>
    finder: PublicUserDto
    beneficiary: PublicUserDto
    tips: {
        tipper: PublicUserDto
        value: NetworkPlanckValue
    }[]
    deposit: NetworkPlanckValue
    findersFee: boolean

    title: Nil<string>
    description: Nil<string>
    owner: Nil<PublicUserDto>

    polkassembly?: Nil<{ title: string }>
}
