import { NetworkPlanckValue } from '../util/types'
import { PublicUserDto } from '../util/publicUser.dto'

export interface TipDto {
    tippersCount: number
    title: string
    polkassembly: {
        title: string
    }
    blockchain: {
        index: number
        description: string
        value: NetworkPlanckValue
        finder: PublicUserDto
        beneficiary: PublicUserDto
    }
}
