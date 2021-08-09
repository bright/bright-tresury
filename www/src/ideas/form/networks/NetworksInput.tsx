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
    ideaNetworks: IdeaNetworkDto[]
}

export type NetworksInputProps = OwnProps

const NetworksInput = ({ ideaNetworks }: NetworksInputProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network, networks } = useNetworks()

    const currentNetworkIndex = ideaNetworks.findIndex((n) => n.name === network.id)
    const availableNetworks = networks.filter((n) => !ideaNetworks.find((ideaNetwork) => ideaNetwork.name === n.id))

    return (
        <FieldArray
            name={'networks'}
            render={(arrayHelpers) => (
                <>
                    <NetworkInput
                        className={classes.inputField}
                        index={currentNetworkIndex}
                        ideaNetwork={ideaNetworks[currentNetworkIndex]}
                    />
                    <div className={classes.inputField}>
                        {ideaNetworks.length > 1 ? (
                            <>
                                <Label label={t('idea.details.form.networks.additionalNets')} />
                                {ideaNetworks.map((ideaNetwork, index) => {
                                    return index !== currentNetworkIndex ? (
                                        <AdditionalNetworkCard
                                            key={ideaNetwork.name}
                                            availableNetworks={availableNetworks}
                                            ideaNetwork={ideaNetwork}
                                            index={index}
                                            removeNetwork={() => {
                                                arrayHelpers.remove(index)
                                            }}
                                        />
                                    ) : null
                                })}
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
