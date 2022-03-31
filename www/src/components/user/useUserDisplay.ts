import { useMemo } from 'react'
import { formatAddress } from '../identicon/utils'
import { useTranslation } from 'react-i18next'
import { useAuth, UserStatus } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { encodeAddress } from '@polkadot/keyring'
import { useNetworks } from '../../networks/useNetworks'
import useIdentity from '../../util/useIdentity'

export interface UseUserDisplayProps {
    user: {
        userId?: string
        username?: Nil<string>
        web3address?: Nil<string>
        status?: UserStatus
    }
    detectYou?: boolean
    ellipsis?: boolean
}

const useUserDisplay = ({ user, detectYou = true, ellipsis = true }: UseUserDisplayProps) => {
    const { t } = useTranslation()
    const { user: authUser } = useAuth()
    const { network } = useNetworks()

    const isDeleted = useMemo(() => user.status === UserStatus.Deleted, [user])

    const isYou = useMemo(() => {
        if (!detectYou || !authUser || isDeleted) return false

        if (user.userId === authUser.id) return true

        if (!user.web3address || !authUser.web3Addresses) return false
        return !!authUser.web3Addresses.find(
            (web3Address) =>
                encodeAddress(web3Address.address, network.ss58Format) ===
                encodeAddress(user.web3address!, network.ss58Format),
        )
    }, [user, isDeleted, authUser])

    const hasUsername = useMemo(() => user.status === UserStatus.EmailPasswordEnabled && user.username, [user])

    const { identity } = useIdentity({ address: !isDeleted ? user.web3address : null })

    const display = useMemo(() => {
        if (isDeleted) return t('account.accountDeleted')
        else if (isYou) return t('common.you')
        else if (hasUsername) return user.username
        else if (identity?.display) return identity.display
        else if (user.web3address) return formatAddress(user.web3address, network.ss58Format, ellipsis)
        else return t('common.na')
    }, [isDeleted, isYou, user, identity, network, ellipsis])
    return { display }
}
export default useUserDisplay
