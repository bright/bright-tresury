import React from 'react'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import Divider from '../../../../components/divider/Divider'
import NetworkValue from '../../../../components/network/NetworkValue'
import MilestoneDescription from '../../../../milestone-details/components/milestone-card/MilestoneDescription'
import MilestoneDateRange from '../../../../milestone-details/components/milestone-card/MilestoneDateRange'
import Card from '../../../../components/card/Card'
import CardDetails from '../../../../components/card/components/CardDetails'
import CardTitle from '../../../../components/card/components/CardTitle'
import { useTranslation } from 'react-i18next'
import CardHeader from '../../../../components/card/components/CardHeader'
import OrdinalNumber from '../../../../components/ordinalNumber/OrdinalNumber'
import IdeaMilestoneStatusIndicator from '../status/IdeaMilestoneStatusIndicator'

const useStyles = makeStyles(() =>
    createStyles({
        cardContent: {
            margin: '0 20px 0 24px',
            cursor: 'pointer',
        },
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
    ideaMilestone: IdeaMilestoneDto
    onClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export type IdeaMilestoneCardProps = OwnProps

const IdeaMilestoneCard = ({ ideaMilestone, onClick }: IdeaMilestoneCardProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Card onClick={() => onClick(ideaMilestone)}>
            <CardHeader>
                <OrdinalNumber
                    prefix={t('idea.milestones.ordinalNumberPrefix')}
                    ordinalNumber={ideaMilestone.ordinalNumber}
                />
                <div className={classes.headerStatusAndDateRange}>
                    <IdeaMilestoneStatusIndicator status={ideaMilestone.status} />
                    <MilestoneDateRange
                        dateFrom={ideaMilestone.details.dateFrom}
                        dateTo={ideaMilestone.details.dateTo}
                    />
                </div>
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={ideaMilestone.details.subject} />
                {ideaMilestone.networks && ideaMilestone.networks.length > 0 ? (
                    <NetworkValue value={ideaMilestone.networks[0].value} />
                ) : null}
            </CardDetails>

            <div className={classes.description}>
                <MilestoneDescription
                    description={ideaMilestone.details.description}
                    placeholder={t('idea.milestones.list.card.noDescriptionProvided')}
                />
            </div>
        </Card>
    )
}

export default IdeaMilestoneCard
