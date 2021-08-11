import thumbsUpIcon from '../../../assets/thumbs_down.svg'
import thumbsDownIcon from '../../../assets/thumbs_down.svg'
import linkIcon from '../../../assets/link.svg'
import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import SmallVerticalDivider from '../../../components/smallHorizontalDivider/SmallVerticalDivider'
import { IdeaCommentDto } from './idea.comment.dto'
import CommentAuthorImage from './CommentAuthorImage'
import { extractTime } from '@polkadot/util'
import { timeToString } from '../../../util/dateUtil'
import { ellipseTextInTheMiddle } from '../../../util/stringUtil'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'

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
            justifyContent: 'spaceBetween',
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
    }),
)

interface OwnProps {
    comment: IdeaCommentDto
}
export type DisplayCommentProps = OwnProps
const DisplayComment = ({ comment: { author, createdAt, thumbsUp, thumbsDown, content } }: DisplayCommentProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const formatAge = (timestamp: number) => {
        const ageMs = Date.now() - timestamp
        if (ageMs < 60 * 1000) return t('lessThanMinuteAgo')
        return `${timeToString(extractTime(ageMs), t)} ${t('ago')}`
    }
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const options = ['Edit', 'Delete']

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <CommentAuthorImage author={author} />
                    <div className={classes.author}>
                        {author.isEmailPasswordEnabled ? author.username : ellipseTextInTheMiddle(author.web3address!)}
                    </div>
                    <SmallVerticalDivider className={classes.grayDivider} />
                    <div className={classes.age}>
                        {t('discussion.commentedTimestampTitle')} {formatAge(createdAt)}
                    </div>
                    <div>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            style={{ fontSize: '4px' }}
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                </div>
                {/* TODO: code below is a feature to be implemented */}
                {/*<div className={styles.headerRight}>*/}
                {/*    <div className={styles.commentHeaderThumb}>*/}
                {/*        <img src={thumbsUpIcon} alt={t('discussion.thumbsUpAlt')} /> {thumbsUp}*/}
                {/*    </div>*/}
                {/*    <div className={styles.commentHeaderThumb}>*/}
                {/*        <img className={styles.rotate180} src={thumbsDownIcon} alt={t('discussion.thumbsDownAlt')'} /> {thumbsDown}*/}
                {/*    </div>*/}
                {/*    <div className={styles.commentHeaderLink}>*/}
                {/*        <img src={linkIcon} alt={''} />*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div className={classes.body}>{content}</div>
        </div>
    )
}
export default DisplayComment
