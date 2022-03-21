import React from 'react'
import { formatAddress } from '../identicon/utils'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useNetworks } from '../../networks/useNetworks'
import { ClassNameProps } from '../props/className.props'
import { AuthorDto } from '../../util/author.dto'
import { UserStatus } from '../../auth/AuthContext'
import { useTranslation } from 'react-i18next'
import { DeriveAccountRegistration } from '@polkadot/api-derive/types'

const useStyles = makeStyles(() =>
    createStyles({
        author: {
            marginLeft: '16px',
            fontWeight: 600,
        },
    }),
)

interface OwnProps {
    author: Pick<AuthorDto, 'status' | 'username' | 'web3address'>
}
export type AuthorProps = OwnProps & ClassNameProps

const Author = ({ author: { status, username, web3address } }: AuthorProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    const { t } = useTranslation()

    return (
        <div className={classes.author}>
            {status === UserStatus.Deleted ? (
                <div>{t('account.accountDeleted')}</div>
            ) : status === UserStatus.EmailPasswordEnabled ? (
                username
            ) : (
                formatAddress(web3address, network.ss58Format)
            )}
        </div>
    )
}
export default Author
