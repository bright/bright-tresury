import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import RouterLink from '../../../../components/link/RouterLink'
import { ProposalContentType } from '../../../../proposals/proposal/ProposalContentTypeTabs'
import { ROUTE_PROPOSAL } from '../../../../routes/routes'
import { IdeaDto } from '../../../ideas.dto'
import { useIdea } from '../../useIdea'
import { generatePath } from 'react-router'

interface OwnProps {
    idea: IdeaDto
}

export type NoIdeaMilestonesInfoProps = OwnProps

const NoIdeaMilestonesInfo = ({ idea }: NoIdeaMilestonesInfoProps) => {
    const { t } = useTranslation()

    const { isOwner, isIdeaMilestonesEditable } = useIdea(idea)

    if (isIdeaMilestonesEditable) {
        if (isOwner) {
            return <p>{t('idea.milestones.noIdeaMilestones.ownerCanAdd')}</p>
        }
        return <p>{t('idea.milestones.noIdeaMilestones.notOwnerCanAdd')}</p>
    }
    return (
        <Trans
            i18nKey="idea.milestones.noIdeaMilestones.cannotAdd"
            components={{
                a: (
                    <RouterLink
                        to={generatePath(`${ROUTE_PROPOSAL}/${ProposalContentType.Milestones}`, {
                            proposalIndex: 1,
                        })}
                    />
                ),
            }}
        />
    )
}

export default NoIdeaMilestonesInfo
