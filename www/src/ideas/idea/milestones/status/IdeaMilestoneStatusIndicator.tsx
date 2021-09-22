import React from 'react'
import { IdeaMilestoneDto, IdeaMilestoneNetworkStatus } from '../idea.milestones.dto'
import { useNetworks } from '../../../../networks/useNetworks'
import { findNetwork } from '../idea.milestones.utils'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import IdeaMilestoneNetworkStatusIndicator from './IdeaMilestoneNetworkStatusIndicator'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        otherStatus: {
            paddingLeft: '6px',
        },
        spacer: {
            marginLeft: '8px',
            borderWidth: '0 0 0 1px',
            borderStyle: 'solid',
            borderColor: theme.palette.text.disabled,
            height: '12px',
        },
    }),
)

interface OwnProps {
    ideaMilestone: IdeaMilestoneDto
}

export type IdeaMilestoneStatusIndicatorProps = OwnProps

const IdeaMilestoneStatusIndicator = ({ ideaMilestone }: IdeaMilestoneStatusIndicatorProps) => {
    const { networks } = useNetworks()
    const classes = useStyles()

    const currentIdeaMilestoneNetworkStatus = ideaMilestone.currentNetwork.status
    // Don't show any status for Active status
    if (currentIdeaMilestoneNetworkStatus === IdeaMilestoneNetworkStatus.Active) return null

    const otherStatus =
        currentIdeaMilestoneNetworkStatus === IdeaMilestoneNetworkStatus.Pending
            ? IdeaMilestoneNetworkStatus.TurnedIntoProposal
            : IdeaMilestoneNetworkStatus.Pending

    const otherNetworkNames = ideaMilestone.additionalNetworks
        .filter(({ status: ideaMilestoneNetworkStatus }) => ideaMilestoneNetworkStatus === otherStatus)
        .map((ideaMilestoneNetwork) => findNetwork(ideaMilestoneNetwork, networks))
        .filter((network) => network !== undefined)
        .map((network) => network!.name)
        .join(',')

    return (
        <div className={classes.root}>
            <IdeaMilestoneNetworkStatusIndicator status={currentIdeaMilestoneNetworkStatus} />
            {otherNetworkNames.length > 0 ? (
                <>
                    <div className={classes.spacer} />
                    <IdeaMilestoneNetworkStatusIndicator
                        className={classes.otherStatus}
                        status={otherStatus}
                        sublabel={`(${otherNetworkNames})`}
                    />
                </>
            ) : null}
        </div>
    )
}

export default IdeaMilestoneStatusIndicator
