import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        default: {
            color: theme.palette.text.hint,
            fontSize: '12px',
        },
    }),
)

interface OwnProps {
    value: string
    className?: string
}

export type PlaceHolderProps = OwnProps

const Placeholder = ({ value, className }: PlaceHolderProps) => {
    const classes = useStyles()
    return <p className={className ?? classes.default}>{value}</p>
}

export default Placeholder
