import React from 'react'
import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '../../../button/IconButton'
import { Label } from '../../../text/Label'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        icon: {
            padding: 0,
            height: '12px',
        },
    }),
)

interface PasswordLabelProps {
    label: string
    icon: string
    iconDescription: string
    onClick: () => void
}

const PasswordLabel = ({ label, icon, iconDescription, onClick }: PasswordLabelProps) => {
    const classes = useStyles()

    return (
        <Label
            label={
                <div className={classes.root}>
                    <div>{label}</div>
                    <IconButton className={classes.icon} svg={icon} alt={iconDescription} onClick={onClick} />
                </div>
            }
        />
    )
}

export default PasswordLabel
