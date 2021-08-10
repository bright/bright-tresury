import { createStyles, makeStyles } from '@material-ui/core/styles'
import { FieldArray } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../../../components/text/Label'
import { useNetworks } from '../../../networks/useNetworks'
import { IdeaNetworkDto } from '../../ideas.dto'
import AdditionalNetworkCard from './AdditionalNetworkCard'
import AddNetworkButton from './AddNetworkButton'
import NetworkInput from './NetworkInput'

const useStyles = makeStyles(() =>
    createStyles({
        inputField: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    currentNetwork: IdeaNetworkDto
    otherNetworks: IdeaNetworkDto[]
}

export type NetworksInputProps = OwnProps

const NetworksInput = ({ currentNetwork, otherNetworks }: NetworksInputProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { networks } = useNetworks()

    const availableNetworks = networks.filter(
        (n) => currentNetwork.name !== n.id && !otherNetworks.find((ideaNetwork) => ideaNetwork.name === n.id),
    )

    return (
        <FieldArray
            name={'networks'}
            render={(arrayHelpers) => (
                <>
                    <NetworkInput
                        className={classes.inputField}
                        inputName={'currentNetwork.value'}
                        ideaNetwork={currentNetwork}
                    />
                    <div className={classes.inputField}>
                        {otherNetworks.length > 1 ? (
                            <>
                                <Label label={t('idea.details.form.networks.additionalNets')} />
                                {otherNetworks.map((ideaNetwork, index) => (
                                    <AdditionalNetworkCard
                                        key={ideaNetwork.name}
                                        availableNetworks={availableNetworks}
                                        ideaNetwork={ideaNetwork}
                                        index={index}
                                        removeNetwork={() => {
                                            arrayHelpers.remove(index)
                                        }}
                                    />
                                ))}
                                )
                            </>
                        ) : null}
                    </div>
                    <AddNetworkButton
                        availableNetworks={availableNetworks}
                        onClick={() => arrayHelpers.push({ name: availableNetworks[0].id, value: 0 })}
                    />
                </>
            )}
        />
    )
}

export default NetworksInput