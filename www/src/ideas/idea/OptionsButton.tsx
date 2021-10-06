import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { breakpoints } from '../../theme/theme'
import clsx from 'clsx'
import { useModal } from '../../components/modal/useModal'
import DeleteIdeaModal from './DeleteIdeaModal'
import { useMenu } from '../../hook/useMenu'
import { useIdea } from './useIdea'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            order: 6,
            marginRight: '20px',
            display: 'flex',
            justifyContent: 'center',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                position: 'relative',
                left: '20px',
                bottom: '10px',
                margin: '0',
            },
        },
        paper: {
            style: {
                maxHeight: 48 * 4.5,
                width: '20ch',
            },
        },
    }),
)

interface OwnProps {
    className: string
    idea: any
}

export type OptionsButtonProps = OwnProps

const OptionsButton = ({ className, idea }: OptionsButtonProps) => {
    const { t } = useTranslation()
    const deleteIdeaModal = useModal()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    const classes = useStyles()

    const onDeleteIdeaClick = () => {
        handleClose()
        deleteIdeaModal.open()
    }

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
                classes={{
                    paper: classes.paper,
                }}
            >
                <MenuItem key={'DeleteIdea'} onClick={onDeleteIdeaClick}>
                    {t('idea.optionsMenu.deleteIdea')}
                </MenuItem>
            </Menu>
            <DeleteIdeaModal idea={idea} open={deleteIdeaModal.visible} onClose={deleteIdeaModal.close} />
        </div>
    )
}

export default OptionsButton
