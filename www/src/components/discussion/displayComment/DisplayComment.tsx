import thumbsUpIcon from '../../../assets/thumbs_down.svg'
import thumbsDownIcon from '../../../assets/thumbs_down.svg'
import linkIcon from '../../../assets/link.svg'
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { formatAddress } from '../../../components/identicon/utils'
import SmallVerticalDivider from '../../smallHorizontalDivider/SmallVerticalDivider'
import { useNetworks } from '../../../networks/useNetworks'
import { IdeaCommentDto } from '../../../ideas/idea/discussion/idea.comment.dto'
import CommentAuthorImage from '../../../ideas/idea/discussion/CommentAuthorImage'
import { extractTime } from '@polkadot/util'
import { timeToString } from '../../../util/dateUtil'
import CommentOptionsMenu from '../../../ideas/idea/discussion/CommentOptionsMenu'
import Error from '../../error/Error'
import { useAuth } from '../../../auth/AuthContext'
import { Nil } from '../../../util/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '20px',
            padding: '16px',
            backgroundColor: theme.palette.background.default,
            border: 'none',
            borderRadius: '8px',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        headerLeft: {
            flexGrow: 2,
            display: 'flex',
        },
        headerRight: {
            display: 'flex',
        },
        author: {
            paddingTop: '6px',
            marginLeft: '16px',
            fontWeight: 600,
        },
        age: {
            paddingTop: '6px',
            color: theme.palette.text.disabled,
        },
        thumb: {
            paddingTop: '8px',
            paddingRight: '8px',
            color: theme.palette.text.disabled,
            margin: '0px 6px',
        },
        rotate180: {
            transform: 'rotate(180deg)',
        },
        link: {
            paddingTop: '8px',
            margin: '0px 6px',
        },
        body: {
            marginTop: '16px',
        },
        grayDivider: {
            color: theme.palette.text.disabled,
        },
        error: {
            fontSize: '12px',
            textAlign: 'right',
            margin: 0,
            marginTop: '6px',
        },
    }),
)

interface OwnProps {
    comment: IdeaCommentDto
    onDeleteClick: () => Promise<void>
    error?: Nil<string>
}
export type DisplayCommentProps = OwnProps

const DisplayComment = ({
    comment: { id, author, createdAt, thumbsUp, thumbsDown, content },
    onDeleteClick,
    error,
}: DisplayCommentProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    const { isUserSignedInAndVerified: canComment, user } = useAuth()
    const isAuthor = user?.id && author.userId && user?.id === author.userId

    const formatAge = (timestamp: number) => {
        const ageMs = Date.now() - timestamp
        if (ageMs < 60 * 1000) return t('lessThanMinuteAgo')
        return `${timeToString(extractTime(ageMs), t)} ${t('ago')}`
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <CommentAuthorImage author={author} />
                    <div className={classes.author}>
                        {author.isEmailPasswordEnabled
                            ? author.username
                            : formatAddress(author.web3address, network.ss58Format)}
                    </div>
                    <SmallVerticalDivider className={classes.grayDivider} />
                    <div className={classes.age}>
                        {t('discussion.commentedTimestampTitle')} {formatAge(createdAt)}
                    </div>
                </div>
                <div className={classes.headerRight}>
                    {/* TODO: code below is a feature to be implemented */}
                    {/*    <div className={styles.commentHeaderThumb}>*/}
                    {/*        <img src={thumbsUpIcon} alt={t('discussion.thumbsUpAlt')} /> {thumbsUp}*/}
                    {/*    </div>*/}
                    {/*    <div className={styles.commentHeaderThumb}>*/}
                    {/*        <img className={styles.rotate180} src={thumbsDownIcon} alt={t('discussion.thumbsDownAlt')'} /> {thumbsDown}*/}
                    {/*    </div>*/}
                    {/*    <div className={styles.commentHeaderLink}>*/}
                    {/*        <img src={linkIcon} alt={''} />*/}
                    {/*    </div>*/}

                    {isAuthor ? <CommentOptionsMenu onEditClick={() => {}} onDeleteClick={onDeleteClick} /> : null}
                </div>
            </div>
            <div className={classes.body}>{content}</div>
            {error ? <Error className={classes.error} text={error}></Error> : <div style={{ height: '24px' }}></div>}
        </div>
    )
}
export default DisplayComment
