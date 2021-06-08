import { makeStyles, Theme } from '@material-ui/core/styles'
import {
    createStyles,
    InputLabel as MaterialInputLabel,
    InputLabelProps as MaterialInputLabelProps,
} from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            marginBottom: '8px',
            color: theme.palette.text.primary,
            fontSize: '12px',
        },
    }),
)

interface OwnProps {
    label: string | JSX.Element
}

export type LabelProps = OwnProps & MaterialInputLabelProps

export const Label = ({ label, className }: LabelProps) => {
    const classes = useStyles()
    return <MaterialInputLabel className={clsx(classes.label, className)}>{label}</MaterialInputLabel>
}
