import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../../../components/form/input/Input'
import { TextFieldColorScheme } from '../../../../../components/form/input/textFieldStyles'
import DateRangeInput from '../../../../../milestone-details/components/form/DateRangeInput'
import DescriptionInput from '../../../../../milestone-details/components/form/DescriptionInput'
import SubjectInput from '../../../../../milestone-details/components/form/SubjectInput'
import { useNetworks } from '../../../../../networks/useNetworks'
import { IdeaMilestoneFormValues } from '../IdeaMilestoneForm'
import { useIdeaMilestoneFormFieldsStyles } from './useIdeaMilestoneFormFieldsStyles'
import NetworkCard from '../../../../../components/network/NetworkCard'
import { IdeaMilestoneNetworkDto } from '../../idea.milestones.dto'
import clsx from 'clsx'
import { findNetwork, isSameNetwork } from '../../idea.milestones.utils'
import Bond from '../../../../form/networks/Bond'
import NetworkInput from '../../../../form/networks/NetworkInput'
import Status from '../../../../../components/status/Status'
import IdeaMilestoneNetworkStatusIndicator from '../../status/IdeaMilestoneNetworkStatus'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    values: IdeaMilestoneFormValues
    readonly: boolean
}

export type IdeaMilestoneFormFieldsProps = OwnProps

const IdeaMilestoneFormFields = ({ values, readonly }: IdeaMilestoneFormFieldsProps) => {
    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()
    const { network: currentNetwork, networks } = useNetworks()

    const compareNetworks = (network1: IdeaMilestoneNetworkDto, network2: IdeaMilestoneNetworkDto) => {
        // sort networks so current network is always first
        if (isSameNetwork(network1, currentNetwork)) return -1
        if (isSameNetwork(network2, currentNetwork)) return 1
        return (network1.name ?? '').localeCompare(network2.name)
    }

    return (
        <div className={classes.root}>
            <SubjectInput readonly={readonly} />
            <Input
                name="beneficiary"
                label={t(`${translationKeyPrefix}.beneficiary`)}
                placeholder={t(`${translationKeyPrefix}.beneficiary`)}
                disabled={readonly}
                textFieldColorScheme={TextFieldColorScheme.Dark}
            />
            <DateRangeInput readonly={readonly} />
            {values.networks.sort(compareNetworks).map((ideaMilestoneNetworkDto, idx) => {
                const network = findNetwork(ideaMilestoneNetworkDto, networks)
                return (
                    <NetworkCard networks={network ? [network] : undefined} className={clsx(classes.withBorder)}>
                        <IdeaMilestoneNetworkStatusIndicator
                            status={ideaMilestoneNetworkDto.status}
                            sublabel={network?.name ?? ''}
                            className={classes.statusIndicator}
                        />
                        <NetworkInput
                            inputName={`networks[${idx}].value`}
                            className={classes.networkInput}
                            value={ideaMilestoneNetworkDto.value}
                            networkId={ideaMilestoneNetworkDto.name}
                            readonly={readonly}
                        />
                    </NetworkCard>
                )
            })}
            <DescriptionInput readonly={readonly} />
        </div>
    )
}

export default IdeaMilestoneFormFields
