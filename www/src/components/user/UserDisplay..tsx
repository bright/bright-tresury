import { useTranslation } from 'react-i18next'
import { useAuth, UserStatus } from '../../auth/AuthContext'
import useIdentity from '../../util/useIdentity'
import { formatAddress } from '../identicon/utils'
import React, { useMemo } from 'react'
import { useNetworks } from '../../networks/useNetworks'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Nil } from '../../util/types'
import { encodeAddress } from '@polkadot/keyring'
import useUserDisplay from './useUserDisplay'

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
            color: theme.palette.text.primary,
            fontSize: '14px',
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

export const UserDisplay = ({ label, ...useUserDisplayProps }: UserDisplayProps) => {
    const classes = useStyles()
    const { display } = useUserDisplay(useUserDisplayProps)

    return (
        <div className={classes.root}>
            <p className={classes.display}>{display}</p>
            {label ? <p className={classes.label}>{label}</p> : null}
        </div>
    )
}
