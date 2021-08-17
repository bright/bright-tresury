import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../../../components/form/input/TextField'
import NetworkCard from '../../../components/network/NetworkCard'
import { Label } from '../../../components/text/Label'
import { useNetworks } from '../../../networks/useNetworks'
import { breakpoints } from '../../../theme/theme'
import IdeaNetworkStatusIndicator from '../../form/networks/IdeaNetworkStatusIndicator'
import NetworkInput from '../../form/networks/NetworkInput'
import { IdeaNetworkDto } from '../../ideas.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            marginBottom: '2em',
        },
        smallField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        content: {
            paddingBottom: '24px',
            paddingTop: '24px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingBottom: '16px',
                paddingTop: '16px',
            },
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {
    ideaNetwork: IdeaNetworkDto
    isOwner: boolean
}

export type AdditionalNetworkCardProps = OwnProps

const AdditionalNetworkDetailsCard = ({ ideaNetwork, isOwner }: AdditionalNetworkCardProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { networks } = useNetworks()

    const selectedNetwork = networks.find((n) => n.id === ideaNetwork.name)

    if (!selectedNetwork) {
        return <></>
    }

    return (
        <NetworkCard className={classes.card} networks={[selectedNetwork]}>
            <div className={classes.content}>
                <IdeaNetworkStatusIndicator ideaNetwork={ideaNetwork} isOwner={isOwner} />
                <FormGroup className={classes.smallField}>
                    <Label label={t('idea.details.net')} />
                    <TextField value={selectedNetwork.name} disabled={true} />
                </FormGroup>
                <NetworkInput ideaNetwork={ideaNetwork} readonly={true} />
            </div>
        </NetworkCard>
    )
}

export default AdditionalNetworkDetailsCard
