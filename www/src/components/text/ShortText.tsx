import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../theme/theme'
import Placeholder from './Placeholder'
import { Nil } from '../../util/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        text: {
            fontSize: '14px',
            fontWeight: 500,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '16px',
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
            <text className={classes.text}>{text || <Placeholder value={placeholder} />}</text>
        </>
    )
}

export default LongText
