import { IdeaMilestoneDto } from '../../idea.milestones.dto'
import { IdeaDto } from '../../../../ideas.dto'
import { useIdeaMilestone } from '../../useIdeaMilestone'
import { useNetworks } from '../../../../../networks/useNetworks'
import NetworkCard from '../../../../../components/network/NetworkCard'
import IdeaMilestoneNetworkStatusIndicator from '../../status/IdeaMilestoneNetworkStatusIndicator'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import NetworkInput from '../../../../form/networks/NetworkInput'
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
            <NetworkInput
                inputName={inputName}
                className={classes.networkInput}
                value={ideaMilestoneNetwork.value}
                networkId={ideaMilestoneNetwork.name}
                readonly={!canEditIdeaMilestoneNetwork(ideaMilestoneNetwork.status)}
            />
        </NetworkCard>
    )
}
export default IdeaMilestoneNetworkCardField
