import { Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import SmallVerticalDivider from '../../components/smallHorizontalDivider/SmallVerticalDivider'
import { AuthorDto } from '../../util/author.dto'
import { CommentDto, DiscussionDto } from '../comments.dto'
import CommentAge from './components/CommentAge'
import CommentAuthor from './components/CommentAuthor'
import CommentContent from './components/CommentContent'
import CommentOptionsMenu from './components/CommentOptionsMenu'
import EditComment from './EditComment'
import Reactions from './reactions/Reactions'

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
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        headerRight: {
            display: 'flex',
        },
    }),
)

interface OwnProps {
    comment: CommentDto
    discussion: DiscussionDto
    people: AuthorDto[]
}
export type DisplayCommentProps = OwnProps

const DisplayComment = ({ comment, discussion, people }: DisplayCommentProps) => {
    const { author, createdAt, updatedAt, content } = comment
    const classes = useStyles()

    const { user } = useAuth()
    const isAuthor = user?.id && author.userId && user?.id === author.userId

    const [editMode, setEditMode] = useState(false)

    const enableEditMode = () => setEditMode(true)
    const disableEditMode = () => setEditMode(false)

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <CommentAuthor author={author} />
                    <SmallVerticalDivider />
                    <CommentAge createdAt={createdAt} updatedAt={updatedAt} />
                </div>
                <div className={classes.headerRight}>
                    <Reactions comment={comment} discussion={discussion} />
                    {isAuthor ? (
                        <CommentOptionsMenu onEdit={enableEditMode} comment={comment} discussion={discussion} />
                    ) : null}
                </div>
            </div>
            {editMode ? (
                <EditComment comment={comment} discussion={discussion} onClose={disableEditMode} people={people} />
            ) : (
                <CommentContent content={content} />
            )}
        </div>
    )
}
export default DisplayComment
