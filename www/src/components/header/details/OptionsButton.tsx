import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'
import { breakpoints } from '../../../theme/theme'
import { ClassNameProps } from '../../props/className.props'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginRight: '-12px',
            alignSelf: 'flex-end',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginBottom: '20px',
            },
        },
    }),
)

interface OwnProps {
    anchorEl: HTMLElement | null
    open: boolean
    handleOpen: (event?: React.MouseEvent<HTMLButtonElement>) => void
    handleClose: () => void
}

export type OptionsButtonProps = PropsWithChildren<OwnProps & ClassNameProps>

const OptionsButton = ({ anchorEl, open, handleClose, handleOpen, className, children }: OptionsButtonProps) => {
    const classes = useStyles()

    return (
        <div className={clsx(classes.root, className)}>
            <IconButton
                color="primary"
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpen}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                {children}
            </Menu>
        </div>
    )
}

export default OptionsButton
