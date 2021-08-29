import { IconButton, Menu, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            padding: '0',
        },
    }),
)

interface OwnProps {
    onEditClick: () => void
    onDeleteClick: () => void
}

export type CommentOptionsMenuProps = OwnProps

const CommentOptionsMenu = ({ onEditClick, onDeleteClick }: CommentOptionsMenuProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const showMenu = (event: any) => setAnchorEl(event.currentTarget)
    const hideMenu = () => setAnchorEl(null)

    const handleEditClick = () => {
        hideMenu()
        onEditClick()
    }
    const handleDeleteClick = () => {
        hideMenu()
        onDeleteClick()
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                className={classes.icon}
                onClick={showMenu}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={hideMenu}
                PaperProps={{
                    style: {
                        maxHeight: 24 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem key={'EditComment'} onClick={handleEditClick}>
                    {t('discussion.edit')}
                </MenuItem>
                <MenuItem key={'DeleteComment'} onClick={handleDeleteClick}>
                    {t('discussion.delete')}
                </MenuItem>
            </Menu>
        </div>
    )
}
export default CommentOptionsMenu
