import React from 'react'
import { IdeaMilestoneDto, IdeaMilestoneNetworkDto, IdeaMilestoneNetworkStatus } from '../idea.milestones.dto'
import { useNetworks } from '../../../../networks/useNetworks'
import { findIdeaMilestoneNetwork, findNetwork } from '../idea.milestones.utils'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core'
import IdeaMilestoneNetworkStatusIndicator from './IdeaMilestoneNetworkStatus'

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
    const { networks, network: currentNetwork } = useNetworks()
    const classes = useStyles()

    const ideaMilestoneNetwork = findIdeaMilestoneNetwork(ideaMilestone.networks, currentNetwork)
    const currentIdeaMilestoneNetworkStatus = ideaMilestoneNetwork!.status
    // Don't show any status for Active status
    if (currentIdeaMilestoneNetworkStatus === IdeaMilestoneNetworkStatus.Active) return null

    const findNetworkNamesWithStatus = (
        ideaMilestoneNetworks: IdeaMilestoneNetworkDto[],
        status: IdeaMilestoneNetworkStatus,
    ) =>
        ideaMilestoneNetworks
            .filter(({ status: ideaMilestoneNetworkStatus }) => ideaMilestoneNetworkStatus === status)
            .map((ideaMilestoneNetwork) => findNetwork(ideaMilestoneNetwork, networks))
            .filter((network) => network !== undefined)
            .map((network) => network!.name)
            .join(',')

    const otherStatus =
        currentIdeaMilestoneNetworkStatus === IdeaMilestoneNetworkStatus.Pending
            ? IdeaMilestoneNetworkStatus.TurnedIntoProposal
            : IdeaMilestoneNetworkStatus.Pending
    const otherNetworkNames = findNetworkNamesWithStatus(ideaMilestone.networks, otherStatus)

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
