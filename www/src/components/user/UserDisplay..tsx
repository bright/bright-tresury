import { useTranslation } from 'react-i18next'
import { useAuth, UserStatus } from '../../auth/AuthContext'
import useIdentity from '../../util/useIdentity'
import { formatAddress } from '../identicon/utils'
import React, { useMemo } from 'react'
import { useNetworks } from '../../networks/useNetworks'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Nil } from '../../util/types'
import { encodeAddress } from '@polkadot/keyring'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '16px',
            fontWeight: 600,
        },
        display: {
            margin: 0,
        },
        label: {
            fontSize: '12px',
            fontWeight: 700,
            marginTop: '3px',
            marginBottom: '0px',
            color: theme.palette.text.disabled,
        },
    }),
)
// TODO: fix this interface in TREAS-457 task
interface OwnProps {
    user: {
        userId?: string
        username?: Nil<string>
        web3address?: Nil<string>
        status?: UserStatus
    }
    ellipsis?: boolean
    label?: string
    detectYou?: boolean
}
export type UserDisplayProps = OwnProps

export const UserDisplay = ({ user, ellipsis = true, label, detectYou = true }: UserDisplayProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { identity } = useIdentity({ address: user.web3address })
    const { user: authUser } = useAuth()

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

    const display = useMemo(() => {
        if (isDeleted) return t('account.accountDeleted')
        else if (isYou) return t('common.you')
        else if (hasUsername) return user.username
        else if (identity?.display) return identity!.display
        else if (user.web3address) return formatAddress(user.web3address, network.ss58Format, ellipsis)
    }, [isDeleted, isYou, user, identity, network, ellipsis])

    return (
        <div className={classes.root}>
            <p className={classes.display}>{display}</p>
            {label ? <p className={classes.label}>{label}</p> : null}
        </div>
    )
}
