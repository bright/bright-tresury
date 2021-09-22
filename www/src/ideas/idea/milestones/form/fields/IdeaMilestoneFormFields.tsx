import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import DateRangeInput from '../../../../../milestone-details/components/form/DateRangeInput'
import DescriptionInput from '../../../../../milestone-details/components/form/DescriptionInput'
import SubjectInput from '../../../../../milestone-details/components/form/SubjectInput'
import { IdeaMilestoneFormValues, mergeFormValuesWithIdeaMilestone } from '../IdeaMilestoneForm'
import { IdeaMilestoneDto } from '../../idea.milestones.dto'
import Button from '../../../../../components/button/Button'
import { MilestoneModalHeader } from '../../../../../milestone-details/components/milestone-modal/MilestoneModalHeader'
import { IdeaDto } from '../../../../ideas.dto'
import { useIdeaMilestone } from '../../useIdeaMilestone'
import IdeaMilestoneNetworkCardField from './IdeaMilestoneNetworkCardField'
import IdeaMilestoneFieldsContainer from './IdeaMilestoneFieldsContainer'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    values: IdeaMilestoneFormValues
    ideaMilestone?: IdeaMilestoneDto
    idea: IdeaDto
    onTurnIntoProposalClick?: (ideaMilestone: IdeaMilestoneDto) => any
}

export type IdeaMilestoneFormFieldsProps = OwnProps

const IdeaMilestoneFormFields = ({
    values,
    ideaMilestone,
    idea,
    onTurnIntoProposalClick,
}: IdeaMilestoneFormFieldsProps) => {
    const { t } = useTranslation()
    const { canEdit, canEditAnyIdeaMilestoneNetwork, canTurnIntoProposal } = useIdeaMilestone(idea, ideaMilestone)

    const renderTitle = () => {
        if (!ideaMilestone) return <>{t('idea.milestones.modal.createMilestone')}</>

        if (canEdit || canEditAnyIdeaMilestoneNetwork) return <>{t('idea.milestones.modal.editMilestone')}</>
        return (
            <>
                {t('idea.milestones.modal.milestone')} - <b>{ideaMilestone.ordinalNumber}</b>
            </>
        )
    }

    const turnIntoProposalClicked = () => {
        if (!onTurnIntoProposalClick || !ideaMilestone) {
            return
        }
        onTurnIntoProposalClick(mergeFormValuesWithIdeaMilestone(values, ideaMilestone))
    }
    return (
        <IdeaMilestoneFieldsContainer>
            <MilestoneModalHeader>
                <h2 id="modal-title">{renderTitle()}</h2>
                {canTurnIntoProposal ? (
                    <Button color="primary" onClick={turnIntoProposalClicked}>
                        {t('idea.details.header.turnIntoProposal')}
                    </Button>
                ) : null}
            </MilestoneModalHeader>
            <SubjectInput readonly={!canEdit} />
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={!canEdit}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <DateRangeInput readonly={canEdit} />
            <IdeaMilestoneNetworkCardField
                idea={idea}
                ideaMilestone={ideaMilestone}
                ideaMilestoneNetwork={values.currentNetwork}
                inputName={'currentNetwork.value'}
            />

            {values.additionalNetworks.map((ideaMilestoneNetwork, idx) => (
                <IdeaMilestoneNetworkCardField
                    idea={idea}
                    ideaMilestone={ideaMilestone}
                    ideaMilestoneNetwork={ideaMilestoneNetwork}
                    inputName={`additionalNetworks[${idx}].value`}
                />
            ))}
            <DescriptionInput readonly={canEdit} />
        </IdeaMilestoneFieldsContainer>
    )
}

export default IdeaMilestoneFormFields
