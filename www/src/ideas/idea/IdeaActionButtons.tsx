import React from 'react'
import ActionButtons, { ActionButtonsProps } from '../../components/header/details/ActionButtons'
import { useTranslation } from 'react-i18next'
import EditButton from '../../components/header/details/EditButton'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_EDIT_IDEA, ROUTE_TURN_IDEA } from '../../routes/routes'
import { IdeaDto } from '../ideas.dto'
import Button from '../../components/button/Button'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaActionButtonsProps = OwnProps & ActionButtonsProps

const IdeaActionButtons = ({ idea, ...props }: IdeaActionButtonsProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const navigateToEdit = () => {
        history.push(generatePath(ROUTE_EDIT_IDEA, { ideaId: idea.id }))
    }
    const navigateToTurnIntoProposal = () => {
        history.push(generatePath(ROUTE_TURN_IDEA, { ideaId: idea.id }), { idea })
    }

    return (
        <ActionButtons {...props}>
            <EditButton label={t('idea.details.edit')} onClick={navigateToEdit} />
            <Button variant="contained" color="primary" onClick={navigateToTurnIntoProposal}>
                {t('idea.details.header.turnIntoProposal')}
            </Button>
        </ActionButtons>
    )
}

export default IdeaActionButtons
