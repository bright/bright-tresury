import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Author from '../../components/author/Author'
import { AuthorDto } from '../../util/author.dto'
import { useTranslation } from 'react-i18next'
import Avatar from '../../components/avatar/Avatar'
import StyledOwnerAvatar from './StyledOwnerAvatar'

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
    }),
)

interface OwnProps {
    owner: AuthorDto
}
export type OwnerInfoProps = OwnProps

const OwnerInfo = ({ owner }: OwnerInfoProps) => {
    const { username, web3address, isEmailPasswordEnabled } = owner
    const classes = useStyles()
    const { t } = useTranslation()
    return (
        <div className={classes.root}>
            <StyledOwnerAvatar>
                <Avatar web3Address={web3address!} username={username} />
            </StyledOwnerAvatar>
            <div className={classes.container}>
                <Author author={owner} />
                <p className={classes.label}>{t('idea.list.card.proposer')}</p>
            </div>
        </div>
    )
}
export default OwnerInfo
