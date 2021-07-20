import React, { useState } from 'react'
import TextField from '../../../components/form/input/TextField'
import { TextFieldColorScheme, useTextFieldStyles } from '../../../components/form/input/textFieldStyles'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CancelSendButtonsComponent from './CancelSendButtonComponent'
import { Collapse, TextareaAutosize } from '@material-ui/core'
import clsx from 'clsx'

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
            '&:focus': {
                border: '1px solid blue',
            },
        },
    }),
)

interface OwnProps {}
export type EnterCommentComponentProps = OwnProps

const EnterCommentComponent = ({}: EnterCommentComponentProps) => {
    const styles = useStyles()
    const [focus, setFocus] = useState(false)
    const [comment, setComment] = useState('')
    const testFieldStyles = useTextFieldStyles({ colorScheme: TextFieldColorScheme.Light })()
    const onSendClick = () => {
        console.log('should send:', comment)
    }

    return (
        <div className={clsx(styles.enterCommentRow, styles.whiteBackground)}>
            <TextareaAutosize
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(event) => setComment(event.target.value)}
                value={comment}
                rowsMin={2}
                rowsMax={5}
                className={clsx(testFieldStyles.input, styles.blueBorder)}
                style={{ width: '100%', resize: 'none' }}
                placeholder="Leave your comment here"
            />

            <Collapse in={!!(focus || comment)}>
                <CancelSendButtonsComponent
                    onCancelClick={() => {
                        setFocus(false)
                        setComment('')
                    }}
                    onSendClick={onSendClick}
                />
            </Collapse>
        </div>
    )
}
export default EnterCommentComponent
