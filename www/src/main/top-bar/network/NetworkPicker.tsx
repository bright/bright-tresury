import { Theme } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Network } from '../../../networks/networks.dto'
import { useNetworks } from '../../../networks/useNetworks'
import MenuItem from '../account/MenuItem'
import NetworkButton from './NetworkButton'
import NetworkName from './NetworkName'
import { useMenu } from '../useMenu'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
        },
    }),
)

const useMenuStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            backgroundColor: theme.palette.background.default,
        },
    }),
)

const NetworkPicker = () => {
    const classes = useStyles()
    const menuClasses = useMenuStyles()

    const { networks, selectedNetwork, selectNetwork } = useNetworks()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const onNetworkChange = (network: Network) => {
        selectNetwork(network)
        handleClose()
    }

    return (
        <div className={classes.root}>
            <NetworkButton onClick={handleOpen} network={selectedNetwork} />
            <Menu
                classes={menuClasses}
                id="simple-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                {networks.map((network) => (
                    <MenuItem
                        onClick={() => {
                            onNetworkChange(network)
                        }}
                    >
                        <NetworkName isMenuItem network={network} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default NetworkPicker
