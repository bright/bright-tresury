import React from 'react'
import IdeaNetworkValueInput from '../../../../form/networks/IdeaNetworkValueInput'
import IdeaNetworkValueTextField from '../../../../form/networks/IdeaNetworkValueTextField'
import { IdeaMilestoneDto } from '../../idea.milestones.dto'
import { IdeaDto } from '../../../../ideas.dto'
import { useIdeaMilestone } from '../../useIdeaMilestone'
import { useNetworks } from '../../../../../networks/useNetworks'
import NetworkCard from '../../../../../components/network/NetworkCard'
import IdeaMilestoneNetworkStatusIndicator from '../../status/IdeaMilestoneNetworkStatusIndicator'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IdeaMilestoneNetworkFormValues } from '../useIdeaMilestoneForm'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        withBorder: {
            border: '1px solid',
            borderColor: theme.palette.background.paper,
        },
        statusIndicator: {
            marginLeft: '-6px',
            marginTop: '10px',
            justifyContent: 'start',
        },
        networkInput: {
            marginBottom: '10px',
        },
    }),
)

interface OwnProps {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
    ideaMilestoneNetwork: IdeaMilestoneNetworkFormValues
    inputName: string
}

export type IdeaMilestoneNetworkCardFieldProps = OwnProps

const IdeaMilestoneNetworkCardField = ({
    idea,
    ideaMilestone,
    ideaMilestoneNetwork,
    inputName,
}: IdeaMilestoneNetworkCardFieldProps) => {
    const classes = useStyles()
    const { canEditIdeaMilestoneNetwork } = useIdeaMilestone(idea, ideaMilestone)
    const { findNetwork } = useNetworks()
    const network = findNetwork(ideaMilestoneNetwork.name)
    if (!network) return null
    return (
        <NetworkCard networks={[network]} className={classes.withBorder}>
            <IdeaMilestoneNetworkStatusIndicator
                status={ideaMilestoneNetwork.status}
                sublabel={network.name ?? ''}
                className={classes.statusIndicator}
            />
            {canEditIdeaMilestoneNetwork(ideaMilestoneNetwork.status) ? (
                <IdeaNetworkValueInput
                    inputName={inputName}
                    className={classes.networkInput}
                    value={ideaMilestoneNetwork.value}
                    networkId={ideaMilestoneNetwork.name}
                />
            ) : (
                <IdeaNetworkValueTextField
                    className={classes.networkInput}
                    value={ideaMilestoneNetwork.value}
                    networkId={ideaMilestoneNetwork.name}
                />
            )}
        </NetworkCard>
    )
}
export default IdeaMilestoneNetworkCardField
