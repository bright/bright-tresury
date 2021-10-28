import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/button/Button'
import NetworkCard from '../../../components/network/NetworkCard'
import FormSelect from '../../../components/select/FormSelect'
import { Network } from '../../../networks/networks.dto'
import { useNetworks } from '../../../networks/useNetworks'
import { breakpoints } from '../../../theme/theme'
import { EditIdeaNetworkDto } from '../../ideas.dto'
import NetworkInput from './NetworkInput'
import { IdeaNetworkFromValues } from '../useIdeaForm'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            marginBottom: '2em',
        },
        inputField: {
            marginTop: '2em',
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                flexDirection: 'column-reverse',
            },
        },
        contentLeft: {
            flexGrow: 1,
        },
        removeButton: {
            alignSelf: 'flex-start',
            color: theme.palette.warning.main,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                alignSelf: 'flex-end',
            },
        },
    }),
)

interface OwnProps {
    ideaNetwork: IdeaNetworkFromValues
    index: number
    availableNetworks: Network[]
    removeNetwork: () => void
}

export type AdditionalNetworkCardProps = OwnProps

const AdditionalNetworkCard = ({
    ideaNetwork,
    index,
    availableNetworks,
    removeNetwork,
}: AdditionalNetworkCardProps) => {
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
                <div className={classes.contentLeft}>
                    <div className={classes.smallField}>
                        <FormSelect
                            renderOption={(option) => networks.find((n) => n.id === option)?.name ?? option}
                            renderValue={(value) => networks.find((n) => n.id === value)?.name ?? ''}
                            name={`additionalNetworks[${index}].name`}
                            label={t('idea.details.form.networks.net')}
                            options={availableNetworks.map((n) => n.id)}
                        />
                    </div>
                    <NetworkInput
                        className={classes.inputField}
                        inputName={`additionalNetworks[${index}].value`}
                        networkId={ideaNetwork.name}
                        value={ideaNetwork.value}
                    />
                </div>
                <Button className={classes.removeButton} variant={'text'} onClick={removeNetwork}>
                    {t('idea.details.form.networks.remove')}
                </Button>
            </div>
        </NetworkCard>
    )
}

export default AdditionalNetworkCard
