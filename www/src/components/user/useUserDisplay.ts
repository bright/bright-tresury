import { DeriveAccountRegistration } from '@polkadot/api-derive/types'
import { encodeAddress } from '@polkadot/keyring'
import { useTranslation } from 'react-i18next'
import { AuthContextUser, useAuth, UserStatus } from '../../auth/AuthContext'
import { Network } from '../../networks/networks.dto'
import { useNetworks } from '../../networks/useNetworks'
import { PublicUserDto } from '../../util/publicUser.dto'
import { Nil } from '../../util/types'
import useIdentity from '../../util/useIdentity'
import { formatAddress } from '../identicon/utils'

export interface UseUserDisplayProps {
    user: PublicUserDto
    detectYou?: boolean
    ellipsis?: boolean
}

export interface UseUserDisplayResult {
    display: string
}

const useUserDisplay = ({ user, detectYou = true, ellipsis = true }: UseUserDisplayProps): UseUserDisplayResult => {
    const { t } = useTranslation()
    const { user: authUser } = useAuth()
    const { network } = useNetworks()

    const { identity } = useIdentity({ address: !isDeleted(user) ? user.web3address : null })

    return { display: display(user, authUser, identity, detectYou, ellipsis, network, t) }
}

const isDeleted = (user: PublicUserDto) => user.status === UserStatus.Deleted

const isYou = (user: PublicUserDto, authUser: Nil<AuthContextUser>, detectYou: boolean, network: Network) => {
    if (!detectYou || !authUser || isDeleted(user)) return false

    if (user.userId === authUser.id) return true

    if (!user.web3address || !authUser.web3Addresses) return false

    return !!authUser.web3Addresses.find(
        (web3Address) =>
            encodeAddress(web3Address.address, network.ss58Format) ===
            encodeAddress(user.web3address!, network.ss58Format),
    )
}

const hasUsername = (user: PublicUserDto) => user.status === UserStatus.EmailPasswordEnabled && user.username

export const display = (
    user: PublicUserDto,
    authUser: Nil<AuthContextUser>,
    identity: Nil<DeriveAccountRegistration>,
    detectYou: boolean,
    ellipsis: boolean,
    network: Network,
    t: (key: string) => string,
): string => {
    if (isDeleted(user)) {
        return t('account.accountDeleted')
    } else if (isYou(user, authUser, detectYou, network)) {
        return t('common.you')
    } else if (hasUsername(user)) {
        return user.username!
    } else if (identity?.display) {
        return identity.display
    } else if (user.web3address) {
        return formatAddress(user.web3address, network.ss58Format, ellipsis)
    } else {
        return t('common.na')
    }
}

export default useUserDisplay
