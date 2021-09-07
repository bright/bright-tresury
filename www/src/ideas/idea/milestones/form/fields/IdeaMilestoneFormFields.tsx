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
import { Network } from '../../../../../networks/networks.dto'
import clsx from 'clsx'

const translationKeyPrefix = 'idea.milestones.modal.form'

interface OwnProps {
    values: IdeaMilestoneFormValues
    readonly: boolean
}

export type IdeaMilestoneFormFieldsProps = OwnProps

const IdeaMilestoneFormFields = ({ values, readonly }: IdeaMilestoneFormFieldsProps) => {
    const classes = useIdeaMilestoneFormFieldsStyles()
    const { t } = useTranslation()
    const {
        network: { currency },
        networks,
    } = useNetworks()
    const findNetwork = (ideaMilestoneNetworkDto: IdeaMilestoneNetworkDto) =>
        networks.find((network) => ideaMilestoneNetworkDto.name === network.id)
    const compareNetworks = (network1: IdeaMilestoneNetworkDto, network2: IdeaMilestoneNetworkDto) =>
        (network1.name ?? '').localeCompare(network2.name)

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
                const network = findNetwork(ideaMilestoneNetworkDto)
                const label = `${t(`${translationKeyPrefix}.budget`)} ${network?.name ?? ''}`
                return (
                    <NetworkCard
                        networks={network ? [network] : undefined}
                        className={clsx(classes.narrowField, classes.withBorder)}
                    >
                        <Input
                            name={`networks[${idx}].value`}
                            type={`number`}
                            label={label}
                            key={idx}
                            endAdornment={currency}
                            textFieldColorScheme={TextFieldColorScheme.Dark}
                            className={classes.ideaMilestoneNetworkInput}
                            disabled={readonly}
                        />
                    </NetworkCard>
                )
            })}
            <DescriptionInput readonly={readonly} />
        </div>
    )
}

export default IdeaMilestoneFormFields
