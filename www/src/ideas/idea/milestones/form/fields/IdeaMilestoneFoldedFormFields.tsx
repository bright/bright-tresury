import React from 'react'
import Input from '../../../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import { useTranslation } from 'react-i18next'
import { useNetworks } from '../../../../../networks/useNetworks'
import { IdeaMilestoneFormValues } from '../IdeaMilestoneForm'
import { IdeaMilestoneDto } from '../../idea.milestones.dto'
import NetworkInput from '../../../../form/networks/NetworkInput'
import { IdeaDto } from '../../../../ideas.dto'
import { useIdeaMilestone } from '../../useIdeaMilestone'
import IdeaMilestoneFieldsContainer from './IdeaMilestoneFieldsContainer'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    values: IdeaMilestoneFormValues
    ideaMilestone?: IdeaMilestoneDto
    idea: IdeaDto
}

export type IdeaMilestoneFoldedFormFieldsProps = OwnProps

const IdeaMilestoneFoldedFormFields = ({ values, ideaMilestone, idea }: IdeaMilestoneFoldedFormFieldsProps) => {
    const { t } = useTranslation()
    const { network: currentNetwork } = useNetworks()
    const { canEdit, canTurnIntoProposal } = useIdeaMilestone(idea, ideaMilestone)
    return (
        <IdeaMilestoneFieldsContainer>
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={!canEdit}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <NetworkInput
                inputName={`currentNetwork.value`}
                networkId={currentNetwork.id}
                value={values.currentNetwork.value}
                readonly={!canTurnIntoProposal}
            />
        </IdeaMilestoneFieldsContainer>
    )
}

export default IdeaMilestoneFoldedFormFields
