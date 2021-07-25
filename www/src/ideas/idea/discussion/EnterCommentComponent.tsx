import React, { useState } from 'react'
import TextField from '../../../components/form/input/TextField'
import { TextFieldColorScheme, useTextFieldStyles } from '../../../components/form/input/textFieldStyles'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CancelSendButtonsComponent from './CancelSendButtonComponent'
import { Collapse, TextareaAutosize } from '@material-ui/core'
import clsx from 'clsx'
import { IdeaCommentDto } from './IdeaComment.dto'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        enterCommentRow: {
            marginTop: '20px',
            padding: '10px',
        },
        whiteBackground: {
            backgroundColor: '#FFFFFF',
            border: '0px solid #FFFFFF',
            borderRadius: '8px',
        },
        blueBorder: {
            border: '4px solid red',
            '&:focus': {
                border: '1px solid blue',
            },
        },
    }),
)

interface OwnProps {
    onSendClick: (commentContent: string) => Promise<void>
}
export type EnterCommentComponentProps = OwnProps

const EnterCommentComponent = ({ onSendClick }: EnterCommentComponentProps) => {
    const styles = useStyles()
    const [focus, setFocus] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const testFieldStyles = useTextFieldStyles({ colorScheme: TextFieldColorScheme.Light })()
    const { t } = useTranslation()
    return (
        <div className={clsx(styles.enterCommentRow, styles.whiteBackground)}>
            <TextareaAutosize
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(event) => setCommentContent(event.target.value)}
                value={commentContent}
                rowsMin={2}
                rowsMax={5}
                className={clsx(testFieldStyles.input)}
                style={{ width: '100%', resize: 'none' }}
                placeholder={t('idea.discussion.enterCommentPlaceholder')}
            />

            <Collapse in={!!(focus || commentContent)}>
                <CancelSendButtonsComponent
                    onCancelClick={() => {
                        setFocus(false)
                        setCommentContent('')
                    }}
                    onSendClick={() => {
                        onSendClick(commentContent).then(() => setCommentContent(''))
                    }}
                />
            </Collapse>
        </div>
    )
}
export default EnterCommentComponent
