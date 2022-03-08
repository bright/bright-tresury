import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextareaAutosize } from '@material-ui/core'
import { TextareaAutosizeProps } from '@material-ui/core/TextareaAutosize/TextareaAutosize'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        commentTextarea: {
            fontFamily: theme.typography.fontFamily,
            fontSize: '14px',
            fontWeight: 500,
            padding: '1em',
            outline: 'none',
            border: '1px solid',
            borderColor: theme.palette.background.paper,
            borderRadius: '3px',
            width: '100%',
            resize: 'none',

            '&:focus': {
                outline: 'none',
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                borderRadius: '3px',
            },
        },
    }),
)

interface OwnProps {}
export type CommentTextareaProps = OwnProps & TextareaAutosizeProps
const CommentTextarea = ({ rowsMin, rowsMax, ...props }: CommentTextareaProps) => {
    const classes = useStyles()
    return (
        <TextareaAutosize
            className={classes.commentTextarea}
            rowsMin={rowsMin ?? 2}
            rowsMax={rowsMax ?? 5}
            {...props}
        />
    )
}
export default CommentTextarea
