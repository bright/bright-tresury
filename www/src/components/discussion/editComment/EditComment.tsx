import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CancelSendButtons from '../cancelSendButtons/CancelSendButtons'
import clsx from 'clsx'
import CommentTextarea from '../commentTextArea/CommentTextArea'
import { Nil } from '../../../util/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        editCommentRow: {
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
        }
    }),
)

interface OwnProps {
    onSendClick: (commentContent: string) => Promise<any>
    onCancelClick: () => any
    value: string
    error?: Nil<string>
}
export type EditCommentProps = OwnProps

const EditComment = ({ onSendClick, onCancelClick, value, error }: EditCommentProps) => {
    const classes = useStyles()
    const [commentContent, setCommentContent] = useState(value)
    return (
        <div className={clsx(classes.editCommentRow)}>
            <CommentTextarea onChange={(event) => setCommentContent(event.target.value)} value={commentContent} />
            <CancelSendButtons
                onCancelClick={onCancelClick}
                onSendClick={() => onSendClick(commentContent)}
                error={error}
            />
        </div>
    )
}
export default EditComment
