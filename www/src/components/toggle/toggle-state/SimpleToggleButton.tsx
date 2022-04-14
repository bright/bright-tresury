import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ToggleButton, ToggleButtonProps } from '@material-ui/lab'
import React from 'react'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '&:hover': {
                backgroundColor: theme.palette.background.default,
            },
        },
        selected: {
            '&&': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.background.default,
                '&:hover': {
                    backgroundColor: theme.palette.background.default,
                },
            },
        },
        label: {
            textTransform: 'none',
            color: theme.palette.text.primary,
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'block',
        },
    }),
)

export type SimpleToggleButtonProps = ToggleButtonProps

const SimpleToggleButton = (props: SimpleToggleButtonProps) => {
    const classes = useStyles()

    return <ToggleButton classes={classes} {...props} />
}

export default SimpleToggleButton
