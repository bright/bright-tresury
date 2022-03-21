import React from 'react'
import { useNetworks } from '../../networks/useNetworks'
import { IdeaDto } from '../ideas.dto'
import { generatePath } from 'react-router-dom'
import { ROUTE_IDEA } from '../../routes/routes'
import Divider from '../../components/divider/Divider'
import { useTranslation } from 'react-i18next'
import IdeaStatusIndicator from '../idea/status/IdeaStatusIndicator'
import NetworkCard from '../../components/network/NetworkCard'
import NetworkValue from '../../components/network/NetworkValue'
import CardHeader from '../../components/card/components/CardHeader'
import CardDetails from '../../components/card/components/CardDetails'
import CardTitle from '../../components/card/components/CardTitle'
import OrdinalNumber from '../../components/ordinalNumber/OrdinalNumber'
import { IdeaContentType } from '../idea/Idea'
import { toNetworkDisplayValue } from '../../util/quota.util'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import User from '../../components/user/User'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        usersInfoContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
        },
    }),
)

interface OwnProps {
    idea: IdeaDto
}

export type IdeaCardProps = OwnProps

const IdeaCard = ({
    idea: {
        id,
        ordinalNumber,
        details: { title },
        currentNetwork,
        additionalNetworks,
        beneficiary,
        owner,
    },
    idea,
}: IdeaCardProps) => {
    const { t } = useTranslation()
    const { network, networks: contextNetworks } = useNetworks()
    const classes = useStyles()

    const networks = contextNetworks.filter((contextNetwork) =>
        [...additionalNetworks, currentNetwork].find((ideaNetwork) => ideaNetwork.name === contextNetwork.id),
    )

    return (
        <NetworkCard
            redirectTo={`${generatePath(ROUTE_IDEA, { ideaId: id })}/${IdeaContentType.Info}`}
            networks={networks}
        >
            <CardHeader>
                <OrdinalNumber prefix={t('idea.ordinalNumberPrefix')} ordinalNumber={ordinalNumber} />
                <IdeaStatusIndicator idea={idea} />
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={title} />
                <NetworkValue value={toNetworkDisplayValue(currentNetwork.value, network.decimals)} />
            </CardDetails>

            <Divider />

            <div className={classes.usersInfoContainer}>
                <User user={{ web3address: beneficiary }} label={t('idea.list.card.beneficiary')} />
                <User user={owner} label={t('idea.list.card.proposer')} />
            </div>
        </NetworkCard>
    )
}

export default IdeaCard
