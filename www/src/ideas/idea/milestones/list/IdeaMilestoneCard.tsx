import React from 'react'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import Divider from '../../../../components/divider/Divider'
import NetworkValue from '../../../../components/network/NetworkValue'
import { IdeaMilestoneDescription } from './IdeaMilestoneDescription'
import { IdeaMilestoneDateRange } from './IdeaMilestoneDateRange'
import Card from '../../../../components/card/Card'
import CardDetails from '../../../../components/card/components/CardDetails'
import CardTitle from '../../../../components/card/components/CardTitle'
import { useTranslation } from 'react-i18next'
import CardHeader from '../../../../components/card/components/CardHeader'
import { OrdinalNumber } from '../../../../components/ordinalNumber/OrdinalNumber'
import { IdeaMilestoneStatusIndicator } from '../status/IdeaMilestoneStatusIndicator'

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

interface Props {
    ideaMilestone: IdeaMilestoneDto
    onClick: (ideaMilestone: IdeaMilestoneDto) => void
}

export const IdeaMilestoneCard = ({ ideaMilestone, onClick }: Props) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Card onClick={() => onClick(ideaMilestone)}>
            <div className={classes.cardContent}>
                <CardHeader>
                    <OrdinalNumber
                        prefix={t('idea.milestones.ordinalNumberPrefix')}
                        ordinalNumber={ideaMilestone.ordinalNumber}
                    />
                    <div className={classes.headerStatusAndDateRange}>
                        <IdeaMilestoneStatusIndicator status={ideaMilestone.status} />
                        <IdeaMilestoneDateRange dateFrom={ideaMilestone.dateFrom} dateTo={ideaMilestone.dateTo} />
                    </div>
                </CardHeader>

                <Divider />

                <CardDetails>
                    <CardTitle title={ideaMilestone.subject} />
                    {ideaMilestone.networks && ideaMilestone.networks.length > 0 ? (
                        <NetworkValue value={ideaMilestone.networks[0].value} />
                    ) : null}
                </CardDetails>

                <div className={classes.description}>
                    <IdeaMilestoneDescription description={ideaMilestone.description} />
                </div>
            </div>
        </Card>
    )
}
