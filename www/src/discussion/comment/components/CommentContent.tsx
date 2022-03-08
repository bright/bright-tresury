import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        commentContent: {
            marginTop: '16px',
            whiteSpace: 'pre-wrap',
        },
    }),
)

interface OwnProps {
    content: string
}
export type CommentContentProps = OwnProps
const CommentContent = ({ content }: CommentContentProps) => {
    const classes = useStyles()
    return <div className={classes.commentContent}>{content}</div>
}
export default CommentContent
