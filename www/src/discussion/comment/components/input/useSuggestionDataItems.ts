import { DeriveAccountRegistration } from '@polkadot/api-derive/types'
import { useTranslation } from 'react-i18next'
import { display } from '../../../../components/user/useUserDisplay'
import { Network } from '../../../../networks/networks.dto'
import { useNetworks } from '../../../../networks/useNetworks'
import { PublicInAppUserDto } from '../../../../util/publicUser.dto'
import { Nil } from '../../../../util/types'
import { useIdentities } from '../../../../util/useIdentity'
import { EnhancedSuggestionDataItem } from './useUserMention'

export const toSuggestionDataItem = (
    user: PublicInAppUserDto,
    identity: Nil<DeriveAccountRegistration>,
    network: Network,
    t: (key: string) => string,
) => ({
    id: user.userId,
    display: display(user, undefined, identity, false, false, network, t),
    author: user,
})

export interface UseSuggestionDataItemsProps {
    users: PublicInAppUserDto[]
}

export interface UseSuggestionDataItemsResult {
    dataItems: EnhancedSuggestionDataItem[]
}

export const useSuggestionDataItems = ({ users }: UseSuggestionDataItemsProps): UseSuggestionDataItemsResult => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    const addresses: string[] = users.map((user) => user.web3address).filter((address) => !!address) as string[]
    const { identities } = useIdentities({ addresses })

    const dataItems = users.map((user) => {
        const identity = user.web3address ? identities?.get(user.web3address) : null
        return toSuggestionDataItem(user, identity, network, t)
    })
    return { dataItems }
}

export default useSuggestionDataItems
