import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import clsx from 'clsx'
import { TypographyProps } from '@material-ui/core'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontWeight: 600,
            marginLeft: '8px',
            marginRight: '8px',
        },
        blackDivider: {
            color: theme.palette.text.disabled,
        },
    }),
)
interface OwnProps {}
export type SmallVerticalDividerProps = OwnProps & TypographyProps

const SmallVerticalDivider = ({ className }: SmallVerticalDividerProps) => {
    const classes = useStyles()
    className = className ? className : classes.blackDivider
    return <span className={clsx(classes.root, className)}>|</span>
}

export default SmallVerticalDivider
