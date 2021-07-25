import thumbsUpIcon from '../../../assets/thumbs_down.svg'
import thumbsDownIcon from '../../../assets/thumbs_down.svg'
import linkIcon from '../../../assets/link.svg'
import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        comment: {
            marginTop: '20px',
            padding: '16px',
        },
        commentHeader: {
            display: 'flex',
            justifyContent: 'spaceBetween',
        },
        commentHeaderLeft: {
            flexGrow: 2,
            display: 'flex',
        },
        commentHeaderRight: {
            display: 'flex',
        },
        commentHeaderAuthorIcon: {
            border: '1px solid #EBEBEB',
            borderRadius: '8px',
            textAlign: 'center',
            paddingTop: '6px',
            width: '32px',
            height: '32px',
            fontWeight: 600,
        },
        commentHeaderAuthor: {
            paddingTop: '6px',
            marginLeft: '16px',
            fontWeight: 600,
        },
        commentHeaderCommentAge: {
            paddingTop: '6px',
            color: '#7B7B7B',
            marginLeft: '16px',
        },
        commentHeaderThumbsUp: {
            paddingTop: '8px',
            paddingRight: '8px',
            color: '#7B7B7B',
            margin: '0px 6px',
        },
        commentHeaderThumbsDown: {
            paddingTop: '8px',
            paddingRight: '8px',
            color: '#7B7B7B',
            margin: '0px 6px',
        },
        rotate180: {
            transform: 'rotate(180deg)',
        },
        commentHeaderLink: {
            paddingTop: '8px',
            margin: '0px 6px',
        },
        commentBody: {
            marginTop: '6px',
        },
        whiteBackground: {
            backgroundColor: '#FFFFFF',
            border: '0px solid #FFFFFF',
            borderRadius: '8px',
        },
    }),
)

interface OwnProps {
    comment: {
        userId: string
        username: string
        timestamp: number
        thumbsUpCount: number
        thumbsDownCount: number
        content: string
    }
    key: number
}
export type CommentComponentProps = OwnProps
const CommentComponent = ({
    comment: { userId, username, timestamp, thumbsUpCount, thumbsDownCount, content },
    key,
}: CommentComponentProps) => {
    const styles = useStyles()
    const { t } = useTranslation()
    const formatAge = (timestamp: number) => {
        const ageMs = Date.now() - timestamp
        return `${Math.floor(ageMs / (1000 * 60))} min ago`
    }
    return (
        <div key={`comment_${key}`} className={`${styles.comment} ${styles.whiteBackground}`}>
            <div className={styles.commentHeader}>
                <div className={styles.commentHeaderLeft}>
                    <div className={styles.commentHeaderAuthorIcon}>{username[0]}</div>
                    <div className={styles.commentHeaderAuthor}>{username}</div>
                    <div className={styles.commentHeaderCommentAge}>
                        {t('idea.discussion.commentedTimestampTitle')} {formatAge(timestamp)}
                    </div>
                </div>
                <div className={styles.commentHeaderRight}>
                    <div className={styles.commentHeaderThumbsUp}>
                        <img src={thumbsUpIcon} alt={''} /> {thumbsUpCount}
                    </div>
                    <div className={styles.commentHeaderThumbsDown}>
                        <img className={styles.rotate180} src={thumbsDownIcon} alt={''} /> {thumbsDownCount}
                    </div>
                    <div className={styles.commentHeaderLink}>
                        <img src={linkIcon} alt={''} />
                    </div>
                </div>
            </div>
            <div className={styles.commentBody}>{content}</div>
        </div>
    )
}
export default CommentComponent
