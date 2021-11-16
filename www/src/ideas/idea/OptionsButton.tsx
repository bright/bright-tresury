import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_EDIT_IDEA } from '../../routes/routes'
import { breakpoints } from '../../theme/theme'
import clsx from 'clsx'
import { useModal } from '../../components/modal/useModal'
import DeleteIdeaModal from './DeleteIdeaModal'
import { useMenu } from '../../hook/useMenu'
import { useIdea } from './useIdea'
import { IdeaDto } from '../ideas.dto'

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
    className: string
    idea: IdeaDto
}

export type OptionsButtonProps = OwnProps

const OptionsButton = ({ className, idea }: OptionsButtonProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const deleteIdeaModal = useModal()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    const { canEditIdea } = useIdea(idea)

    const onDeleteIdeaClick = () => {
        handleClose()
        deleteIdeaModal.open()
    }

    const onEditIdeaClick = () => {
        history.push(generatePath(ROUTE_EDIT_IDEA, { ideaId: idea.id }))
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
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <MenuItem key={'DeleteIdea'} onClick={onEditIdeaClick} disabled={!canEditIdea}>
                    {t('idea.optionsMenu.editIdea')}
                </MenuItem>
                <MenuItem key={'DeleteIdea'} onClick={onDeleteIdeaClick} disabled={!canEditIdea}>
                    {t('idea.optionsMenu.deleteIdea')}
                </MenuItem>
            </Menu>
            <DeleteIdeaModal idea={idea} open={deleteIdeaModal.visible} onClose={deleteIdeaModal.close} />
        </div>
    )
}

export default OptionsButton
