import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import userDeleted from '../../../assets/user-deleted.svg'
import { UserStatus } from '../../../auth/AuthContext'
import { breakpoints } from '../../../theme/theme'
import { AuthorDto } from '../../../util/author.dto'
import Author from '../../../components/author/Author'
import Avatar from '../../../components/avatar/Avatar'
import StyledAvatar from './StyledAvatar'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        name: {
            marginLeft: '20px',
        },
        avatar: {
            height: '32px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                height: '42px',
            },
        },
    }),
)

interface OwnProps {
    author: AuthorDto
}
export type CommentAuthorProps = OwnProps
const CommentAuthor = ({ author }: CommentAuthorProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            {author.status === UserStatus.Deleted ? (
                <>
                    <img className={classes.avatar} src={userDeleted} alt={'userDeletedImage'} />
                    <div className={classes.name}>{t('discussion.accountDeleted')}</div>
                </>
            ) : (
                <>
                    <StyledAvatar>
                        <Avatar username={author.username} web3Address={author.web3address} />
                    </StyledAvatar>
                    <Author author={author} />
                </>
            )}
        </div>
    )
}
export default CommentAuthor
