import React from 'react'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import Divider from '../../../../components/divider/Divider'
import NetworkValue from '../../../../components/network/NetworkValue'
import MilestoneDateRange from '../../../../milestone-details/components/milestone-card/MilestoneDateRange'
import ButtonCard from '../../../../components/card/ButtonCard'
import CardDetails from '../../../../components/card/components/CardDetails'
import CardTitle from '../../../../components/card/components/CardTitle'
import { useTranslation } from 'react-i18next'
import CardHeader from '../../../../components/card/components/CardHeader'
import OrdinalNumber from '../../../../components/ordinalNumber/OrdinalNumber'
import IdeaMilestoneStatusIndicator from '../status/IdeaMilestoneStatusIndicator'
import { toNetworkDisplayValue } from '../../../../util/quota.util'
import { useNetworks } from '../../../../networks/useNetworks'
import MilestoneDescription from '../../../../milestone-details/components/milestone-card/MilestoneDescription'

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
            marginTop: 0,
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
    const { findNetwork } = useNetworks()
    const ideaMilestoneNetwork = ideaMilestone.currentNetwork

    return (
        <ButtonCard onClick={() => onClick(ideaMilestone)}>
            <CardHeader>
                <OrdinalNumber
                    prefix={t('idea.milestones.ordinalNumberPrefix')}
                    ordinalNumber={ideaMilestone.ordinalNumber}
                />
                <div className={classes.headerStatusAndDateRange}>
                    <IdeaMilestoneStatusIndicator ideaMilestone={ideaMilestone} />
                    <MilestoneDateRange
                        dateFrom={ideaMilestone.details.dateFrom}
                        dateTo={ideaMilestone.details.dateTo}
                    />
                </div>
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={ideaMilestone.details.subject} />
                {ideaMilestoneNetwork ? (
                    <NetworkValue
                        value={toNetworkDisplayValue(
                            ideaMilestoneNetwork.value,
                            findNetwork(ideaMilestoneNetwork.name)!.decimals,
                        )}
                    />
                ) : null}
            </CardDetails>

            <div className={classes.description}>
                <MilestoneDescription
                    description={ideaMilestone.details.description}
                    placeholder={t('idea.milestones.list.card.noDescriptionProvided')}
                />
            </div>
        </ButtonCard>
    )
}

export default IdeaMilestoneCard
