import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CancelSendButtons from './CancelSendButtons'
import { Collapse, TextareaAutosize } from '@material-ui/core'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Nil } from '../../../util/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        enterCommentRow: {
            marginTop: '20px',
            padding: '18px',
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
    onCancelClick?: Nil<() => void>
    error?: Nil<string>
}
export type EnterCommentProps = OwnProps

const EnterComment = ({ onSendClick, error, onCancelClick }: EnterCommentProps) => {
    const classes = useStyles()
    const [focus, setFocus] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const { t } = useTranslation()
    const onEnterCommentSendClick = () => onSendClick(commentContent).then(() => setCommentContent(''))

    const onEnterCommentCancelClick = () => {
        setFocus(false)
        setCommentContent('')
        if (onCancelClick) onCancelClick()
    }

    return (
        <div className={clsx(classes.enterCommentRow)}>
            <TextareaAutosize
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(event) => setCommentContent(event.target.value)}
                value={commentContent}
                rowsMin={2}
                rowsMax={5}
                className={classes.textarea}
                style={{ width: '100%', resize: 'none' }}
                placeholder={t('discussion.enterCommentPlaceholder')}
            />

            <Collapse in={!!(focus || commentContent)}>
                <CancelSendButtons
                    onCancelClick={onEnterCommentCancelClick}
                    onSendClick={onEnterCommentSendClick}
                    error={error}
                />
            </Collapse>
        </div>
    )
}
export default EnterComment
