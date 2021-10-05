import { createStyles, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'
import { useHistory } from 'react-router-dom'
import { useNetworks } from '../../../../../networks/useNetworks'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '24px',
            borderWidth: '1px 0 0 0',
            borderColor: theme.palette.divider,
            borderStyle: 'solid',
            '&:hover': {
                backgroundColor: theme.palette.primary.light,
            },
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {
    redirectTo: string
    networkId?: string
    closeMenu: () => void
}

export type NotificationsMenuItemProps = PropsWithChildren<OwnProps>

const NotificationsMenuItem = ({ redirectTo, closeMenu, children, networkId }: NotificationsMenuItemProps) => {
    const history = useHistory()
    const { selectNetwork, network } = useNetworks()

    const onClick = () => {
        if (networkId && network.id !== networkId) {
            selectNetwork(networkId, redirectTo)
        } else {
            history.push(redirectTo)
            closeMenu()
        }
    }

    const classes = useStyles({})
    return (
        <MenuItem onClick={onClick} className={classes.root}>
            {children}
        </MenuItem>
    )
}

export default NotificationsMenuItem
