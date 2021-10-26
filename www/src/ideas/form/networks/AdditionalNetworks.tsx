import { FieldArray } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClassNameProps } from '../../../components/props/className.props'
import { Label } from '../../../components/text/Label'
import { useNetworks } from '../../../networks/useNetworks'
import { EditIdeaNetworkDto } from '../../ideas.dto'
import AdditionalNetworkCard from './AdditionalNetworkCard'
import AddNetworkButton from './AddNetworkButton'

interface OwnProps {
    currentNetwork: EditIdeaNetworkDto
    additionalNetworks: EditIdeaNetworkDto[]
}

export type AdditionalNetworksProps = OwnProps & ClassNameProps

const AdditionalNetworks = ({ currentNetwork, additionalNetworks, className }: AdditionalNetworksProps) => {
    const { t } = useTranslation()
    const { networks } = useNetworks()

    const availableNetworks = networks.filter(
        (n) => currentNetwork.name !== n.id && !additionalNetworks.find((ideaNetwork) => ideaNetwork.name === n.id),
    )

    return (
        <FieldArray
            name={'additionalNetworks'}
            render={(arrayHelpers) => (
                <div className={className}>
                    {additionalNetworks.length ? (
                        <>
                            <Label label={t('idea.details.additionalNets')} />
                            {additionalNetworks.map((ideaNetwork, index) => {
                                const ideaNetworkNetwork = networks.find((n) => n.id === ideaNetwork.name)!
                                const currentAvailableNetworks = [ideaNetworkNetwork].concat(availableNetworks)
                                return (
                                    <AdditionalNetworkCard
                                        key={ideaNetwork.name}
                                        availableNetworks={currentAvailableNetworks}
                                        ideaNetwork={ideaNetwork}
                                        index={index}
                                        removeNetwork={() => arrayHelpers.remove(index)}
                                    />
                                )
                            })}
                        </>
                    ) : null}
                    <AddNetworkButton
                        availableNetworks={availableNetworks}
                        onClick={() => arrayHelpers.push({ name: availableNetworks[0].id, value: 0 })}
                    />
                </div>
            )}
        />
    )
}

export default AdditionalNetworks
