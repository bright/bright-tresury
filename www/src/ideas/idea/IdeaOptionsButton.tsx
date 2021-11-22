import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import OptionsButton from '../../components/header/details/OptionsButton'
import { useModal } from '../../components/modal/useModal'
import { ClassNameProps } from '../../components/props/className.props'
import { useMenu } from '../../hook/useMenu'
import { ROUTE_EDIT_IDEA } from '../../routes/routes'
import { IdeaDto } from '../ideas.dto'
import DeleteIdeaModal from './DeleteIdeaModal'
import { useIdea } from './useIdea'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaOptionsButtonProps = OwnProps & ClassNameProps

const IdeaOptionsButton = ({ className, idea }: IdeaOptionsButtonProps) => {
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
        <>
            <OptionsButton
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
                handleOpen={handleOpen}
                className={className}
            >
                <MenuItem key={'DeleteIdea'} onClick={onEditIdeaClick} disabled={!canEditIdea}>
                    {t('idea.optionsMenu.editIdea')}
                </MenuItem>
                <MenuItem key={'DeleteIdea'} onClick={onDeleteIdeaClick} disabled={!canEditIdea}>
                    {t('idea.optionsMenu.deleteIdea')}
                </MenuItem>
            </OptionsButton>
            <DeleteIdeaModal idea={idea} open={deleteIdeaModal.visible} onClose={deleteIdeaModal.close} />
        </>
    )
}

export default IdeaOptionsButton
