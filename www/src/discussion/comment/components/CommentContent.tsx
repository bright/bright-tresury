import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        commentContent: {
            marginTop: '16px',
            whiteSpace: 'pre-wrap',
        },
        mention: {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightBold,
        },
    }),
)

interface OwnProps {
    content: string
}
export type CommentContentProps = OwnProps
const CommentContent = ({ content }: CommentContentProps) => {
    const classes = useStyles()
    return (
        <>
            {/*TODO show the info icon and identity details TREAS-455*/}
            <ReactMarkdown
                components={{ a: ({ node, ...props }) => <span className={classes.mention}>{props.children}</span> }}
                className={classes.commentContent}
            >
                {content}
            </ReactMarkdown>
        </>
    )
}
export default CommentContent
