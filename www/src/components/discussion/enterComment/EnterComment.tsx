import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CancelSendButtons from '../cancelSendButtons/CancelSendButtons'
import { Collapse } from '@material-ui/core'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Nil } from '../../../util/types'
import CommentTextarea from '../commentTextArea/CommentTextArea'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        enterCommentRow: {
            marginTop: '20px',
            padding: '18px',
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
        },
    }),
)

interface OwnProps {
    onSendClick: (commentContent: string) => Promise<void>
    onCancelClick?: Nil<() => void>
    error?: Nil<string>
    isLoading: boolean
}
export type EnterCommentProps = OwnProps

const EnterComment = ({ onSendClick, error, onCancelClick, isLoading }: EnterCommentProps) => {
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
            <CommentTextarea
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(event) => setCommentContent(event.target.value)}
                value={commentContent}
                placeholder={t('discussion.enterCommentPlaceholder')}
            />

            <Collapse in={!!(focus || commentContent)}>
                <CancelSendButtons
                    onCancelClick={onEnterCommentCancelClick}
                    onSendClick={onEnterCommentSendClick}
                    error={error}
                    isLoading={isLoading}
                />
            </Collapse>
        </div>
    )
}
export default EnterComment
