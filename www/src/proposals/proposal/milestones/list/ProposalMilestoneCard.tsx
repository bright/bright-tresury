import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ButtonCard from '../../../../components/card/Card'
import CardDetails from '../../../../components/card/components/CardDetails'
import CardHeader from '../../../../components/card/components/CardHeader'
import CardTitle from '../../../../components/card/components/CardTitle'
import Divider from '../../../../components/divider/Divider'
import OrdinalNumber from '../../../../components/ordinalNumber/OrdinalNumber'
import MilestoneDateRange from '../../../../milestone-details/components/milestone-card/MilestoneDateRange'
import MilestoneDescription from '../../../../milestone-details/components/milestone-card/MilestoneDescription'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'

const useStyles = makeStyles(() =>
    createStyles({
        headerStatusAndDateRange: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: '5px',
            height: '45px',
        },
        description: {
            height: '50px',
            marginBottom: '20px',
        },
    }),
)

interface OwnProps {
    milestone: ProposalMilestoneDto
    onClick: (milestone: ProposalMilestoneDto) => void
}

export type ProposalMilestoneCardProps = OwnProps

const ProposalMilestoneCard = ({ milestone, onClick }: ProposalMilestoneCardProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <ButtonCard onClick={() => onClick(milestone)}>
            <CardHeader>
                <OrdinalNumber
                    prefix={t('idea.milestones.ordinalNumberPrefix')}
                    ordinalNumber={milestone.ordinalNumber}
                />
                <div className={classes.headerStatusAndDateRange}>
                    <MilestoneDateRange dateFrom={milestone.details.dateFrom} dateTo={milestone.details.dateTo} />
                </div>
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={milestone.details.subject} />
            </CardDetails>

            <div className={classes.description}>
                <MilestoneDescription
                    description={milestone.details.description}
                    placeholder={t('proposal.milestones.list.card.noDescriptionProvided')}
                />
            </div>
        </ButtonCard>
    )
}

export default ProposalMilestoneCard
