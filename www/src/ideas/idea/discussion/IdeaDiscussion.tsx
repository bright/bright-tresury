import React from 'react'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Link from '../../../components/link/Link'
import TextField from '../../../components/form/input/TextField'
import thumbsDownIcon from '../../../assets/thumbs_down.svg'
import thumbsUpIcon from '../../../assets/thumbs_down.svg'
import linkIcon from '../../../assets/link.svg'
import { TextFieldColorScheme } from '../../../components/form/input/textFieldStyles'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        topRow: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        copyLinkSection: {
            display: 'flex',
            justifyContent: 'spaceBetween',
            flexGrow: 2,
        },
        link: {
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.palette.text.primary,
            padding: '4px 8px',
        },
        divider: {
            fontWeight: 600,
        },
        whiteBackground: {
            backgroundColor: '#FFFFFF',
            border: '0px solid #FFFFFF',
            borderRadius: '8px',
        },
        commentsContainer: {
            width: '60%',
        },
        enterCommentRow: {
            marginTop: '20px',
            padding: '10px',
            height: '80px',
        },
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
    }),
)

export const IdeaDiscussion = () => {
    const classes = useSuccessfullyLoadedItemStyles()
    const styles = useStyles()

    return (
        <div className={classes.content}>
            <div className={styles.topRow}>
                <div className={styles.copyLinkSection}>
                    <Link className={`${styles.link} ${styles.whiteBackground}`}>
                        http://localhost:3000/ideas/5f88079b-b412-48ed-9b2c-9443496c3c91/discussion
                    </Link>
                    <Link className={styles.link}>copy link</Link>
                </div>

                <div>
                    Comment also on
                    <Link className={styles.link}>Polkassembly</Link>
                    <span className={styles.divider}>|</span>
                    <Link className={styles.link}>Element</Link>
                </div>
            </div>

            <div className={styles.commentsContainer}>
                <div className={`${styles.enterCommentRow} ${styles.whiteBackground}`}>
                    <TextField
                        fullWidth={true}
                        colorScheme={TextFieldColorScheme.Light}
                        inputProps={{ placeholder: 'Leave your comment here' }}
                    />
                </div>

                <div className={`${styles.comment} ${styles.whiteBackground}`}>
                    <div className={styles.commentHeader}>
                        <div className={styles.commentHeaderLeft}>
                            <div className={styles.commentHeaderAuthorIcon}>S</div>
                            <div className={styles.commentHeaderAuthor}>Sasha_Moshito</div>
                            <div className={styles.commentHeaderCommentAge}> | commented 2 min ago</div>
                        </div>
                        <div className={styles.commentHeaderRight}>
                            <div className={styles.commentHeaderThumbsUp}>
                                <img src={thumbsUpIcon} alt={''} /> 4
                            </div>
                            <div className={styles.commentHeaderThumbsDown}>
                                <img className={styles.rotate180} src={thumbsDownIcon} alt={''} /> 0
                            </div>
                            <div className={styles.commentHeaderLink}>
                                <img src={linkIcon} alt={''} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.commentBody}>
                        Dear Farah, thank you for asking. I think the idea is brilliant, however needs some
                        clarification. Please let me know if you have someone who will help you in developing the
                        project? What are the threads if the project is not developed well?
                    </div>
                </div>

                <div className={`${styles.comment} ${styles.whiteBackground}`}>
                    <div className={styles.commentHeader}>
                        <div className={styles.commentHeaderLeft}>
                            <div className={styles.commentHeaderAuthorIcon}>F</div>
                            <div className={styles.commentHeaderAuthor}>Farah</div>
                            <div className={styles.commentHeaderCommentAge}> | commented 4 min ago</div>
                        </div>
                        <div className={styles.commentHeaderRight}>
                            <div className={styles.commentHeaderThumbsUp}>
                                <img src={thumbsUpIcon} alt={''} /> 1
                            </div>
                            <div className={styles.commentHeaderThumbsDown}>
                                <img className={styles.rotate180} src={thumbsDownIcon} alt={''} /> 0
                            </div>
                            <div className={styles.commentHeaderLink}>
                                <img src={linkIcon} alt={''} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.commentBody}>
                        @Sasha_Moshito could you please look at my idea for the proposal and let me know it is worth
                        doing it and if it is an interesting topic to develop?{' '}
                    </div>
                </div>
            </div>
        </div>
    )
}
