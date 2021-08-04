import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import Placeholder from '../components/text/Placeholder'
import { breakpoints } from '../theme/theme'
import { Nil } from '../util/types'

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
            width: '70%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
                padding: '16px',
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '10px',
                fontSize: '14px',
            },
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
                <textarea value={text} className={classes.longText} disabled={true} />
            ) : (
                <div className={classes.longText}>
                    <Placeholder value={placeholder} />
                </div>
            )}
        </>
    )
}

export default LongText
