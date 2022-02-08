import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { breakpoints } from '../../theme/theme'
import { Nil } from '../../util/types'
import Placeholder from './Placeholder'

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

export type ShortTextProps = OwnProps

const ShortText = ({ text, placeholder }: ShortTextProps) => {
    const classes = useStyles()

    return <div className={classes.text}>{text || <Placeholder value={placeholder} />}</div>
}

export default ShortText
