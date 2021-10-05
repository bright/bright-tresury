import { Theme } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ClassNameProps } from '../../../components/props/className.props'
import { Network } from '../../../networks/networks.dto'
import { useNetworks } from '../../../networks/useNetworks'
import MenuItem from '../account/MenuItem'
import { useMenu } from '../../../hook/useMenu'
import NetworkButton from './NetworkButton'
import NetworkName from './NetworkName'
import clsx from 'clsx'

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

export type NetworkPickerProps = ClassNameProps

const NetworkPicker = ({ className }: NetworkPickerProps) => {
    const classes = useStyles()
    const menuClasses = useMenuStyles()

    const { networks, network, selectNetwork } = useNetworks()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const onNetworkChange = (newNetwork: Network) => {
        selectNetwork(newNetwork.id)
        handleClose()
    }

    return (
        <div className={clsx(classes.root, className)}>
            <NetworkButton onClick={handleOpen} network={network} />
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
                        key={network.id}
                        onClick={() => {
                            onNetworkChange(network)
                        }}
                    >
                        <NetworkName variant={'dark'} network={network} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default NetworkPicker
