import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ToggleButtonGroup, ToggleButtonGroupProps } from '@material-ui/lab'
import React from 'react'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridAutoFlow: 'column',
            gap: '1em',
            gridAutoColumns: '1fr',
        },
        grouped: {
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.background.default,
        },
        groupedHorizontal: {
            '&&': {
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
                borderTopLeftRadius: '6px',
                borderBottomLeftRadius: '6px',
            },
            '&:not(:last-child)': {
                marginRight: '24px',
            },
        },
    }),
)

interface OwnProps<T> {
    value: T
    setValue: (mode: T) => void
}

export type SimpleToggleButtonGroupProps<T> = OwnProps<T> & Omit<ToggleButtonGroupProps, 'onChange'>

function SimpleToggleButtonGroup<T>({ value, setValue, children, ...props }: SimpleToggleButtonGroupProps<T>) {
    const classes = useStyles()

    const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: T) => {
        if (newValue !== null) {
            setValue(newValue)
        }
    }

    return (
        <ToggleButtonGroup classes={classes} value={value} exclusive onChange={handleChange} {...props}>
            {children}
        </ToggleButtonGroup>
    )
}

export default SimpleToggleButtonGroup
