import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Author from '../../components/author/Author'
import { AuthorDto } from '../../util/author.dto'
import { useTranslation } from 'react-i18next'
import Avatar from '../../components/avatar/Avatar'
import StyledOwnerAvatar from './StyledOwnerAvatar'
import { UserStatus } from '../../auth/AuthContext'
import accountDeleted from '../../assets/user-deleted.svg'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        label: {
            fontSize: '12px',
            fontWeight: 700,
            marginTop: '3px',
            marginLeft: '16px',
            color: theme.palette.text.disabled,
            position: 'relative',
            bottom: '5px',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            right: '5px',
            top: '5px',
        },
        accountDeletedAvatar: {
            width: '32px',
            height: '32px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '42px',
                height: '42px',
            },
        },
        image: {
            height: '100%',
        },
    }),
)

interface OwnProps {
    owner: AuthorDto
}
export type OwnerInfoProps = OwnProps

const OwnerInfo = ({ owner }: OwnerInfoProps) => {
    const { username, web3address, status } = owner
    const classes = useStyles()
    const { t } = useTranslation()
    return (
        <div className={classes.root}>
            <StyledOwnerAvatar>
                {owner.status !== UserStatus.Deleted ? (
                    <Avatar web3Address={web3address} username={username} />
                ) : (
                    <div className={classes.accountDeletedAvatar}>
                        <img className={classes.image} src={accountDeleted} />
                    </div>
                )}
            </StyledOwnerAvatar>
            <div className={classes.container}>
                <Author author={owner} />
                <p className={classes.label}>{t('idea.list.card.proposer')}</p>
            </div>
        </div>
    )
}
export default OwnerInfo
