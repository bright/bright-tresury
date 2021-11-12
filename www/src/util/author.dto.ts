import { Nil } from './types'

export interface AuthorDto {
    userId: string
    web3address: Nil<string>
    username: Nil<string>
    isEmailPasswordEnabled: boolean
}
