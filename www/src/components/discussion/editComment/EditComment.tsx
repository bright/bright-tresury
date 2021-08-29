import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CancelSendButtons from '../cancelSendButtons/CancelSendButtons'
import { Collapse, TextareaAutosize } from '@material-ui/core'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        editCommentRow: {
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
        },
        textarea: {
            fontFamily: theme.typography.fontFamily,
            fontSize: '14px',
            fontWeight: 500,
            padding: '1em',
            outline: 'none',
            border: '1px solid',
            borderColor: theme.palette.background.paper,
            borderRadius: '3px',

            '&:focus': {
                outline: 'none',
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                borderRadius: '3px',
            },
        },
    }),
)

interface OwnProps {
    onSendClick: (commentContent: string) => Promise<void>
    onCancelClick: () => void
    value: string
    initialFocus?: boolean
}
export type EditCommentProps = OwnProps

const EditComment = ({ onSendClick, onCancelClick, value, initialFocus = true }: EditCommentProps) => {
    const classes = useStyles()
    const [sendCommentError, setSendCommentError] = useState('')
    const [focus, setFocus] = useState(initialFocus)
    const [commentContent, setCommentContent] = useState(value)
    const { t } = useTranslation()
    const onEditCommentSendClick = () =>
        onSendClick(commentContent).catch(() => setSendCommentError(t('discussion.sendCommentError')))
    let textArea: HTMLElement | null
    useEffect(() => {
        if (focus) textArea?.focus()
    }, [focus])
    return (
        <div className={clsx(classes.editCommentRow)}>
            <TextareaAutosize
                onChange={(event) => setCommentContent(event.target.value)}
                value={commentContent}
                ref={(input) => {
                    textArea = input
                }}
                rowsMin={2}
                rowsMax={5}
                className={classes.textarea}
                style={{ width: '100%', resize: 'none' }}
            />
            <CancelSendButtons
                onCancelClick={onCancelClick}
                onSendClick={onEditCommentSendClick}
                error={sendCommentError}
            />
        </div>
    )
}
export default EditComment
