import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import Placeholder from './Placeholder'
import { Nil } from '../../util/types'
import Markdown from '../markdown/Markdown'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        longText: {
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
            border: 'none',
            padding: '20px',
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 400,
            width: '100%',
            resize: 'vertical',
            whiteSpace: 'pre-wrap',
        },
        markdown: {
            padding: '10px 20px 10px 20px',
            borderRadius: '8px',
            background: theme.palette.background.default,
        },
    }),
)

interface OwnProps {
    text: Nil<string>
    placeholder: string
}

export type LongTextProps = OwnProps

const LongText = ({ text, placeholder }: LongTextProps) => {
    const classes = useStyles()

    return (
        <>
            {text ? (
                <Markdown className={classes.markdown}>{text}</Markdown>
            ) : (
                <div className={classes.longText}>
                    <Placeholder value={placeholder} />
                </div>
            )}
        </>
    )
}

export default LongText
