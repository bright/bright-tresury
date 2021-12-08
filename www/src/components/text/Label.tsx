import { makeStyles, Theme } from '@material-ui/core/styles'
import {
    createStyles,
    InputLabel as MaterialInputLabel,
    InputLabelProps as MaterialInputLabelProps,
} from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'
import { Nil } from '../../util/types'
import InformationTip from '../info/InformationTip'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: '8px',
            color: theme.palette.text.primary,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
    }),
)

interface OwnProps {
    label: string | JSX.Element
    description?: Nil<string>
}

export type LabelProps = OwnProps & MaterialInputLabelProps

export const Label = ({ label, description, className }: LabelProps) => {
    const classes = useStyles()
    return (
        <MaterialInputLabel className={clsx(classes.root, className)}>
            {label}
            {description ? <InformationTip label={description} /> : null}
        </MaterialInputLabel>
    )
}
