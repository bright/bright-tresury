import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import { Button, ButtonProps } from '../../../components/button/Button'

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            fontWeight: 'bold',
            color: theme.palette.warning.main,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginRight: '0px',
            },
        },
    }
})

interface OwnProps {
    label: string
    className: string
    disabled: boolean
}

type Props = OwnProps & ButtonProps

export const Web3LinkingButton = ({ label, className, ...props }: Props) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Button {...props} type="submit" variant={'text'} className={className}>
                {label}
            </Button>
        </div>
    )
}
