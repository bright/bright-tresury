import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { networkValueValidationSchema } from '../../../../components/form/input/networkValue/NetworkValueInput'
import { formatAddress } from '../../../../components/identicon/utils'
import useMilestoneDetailsForm from '../../../../milestone-details/useMilestoneDetailsForm'
import { useNetworks } from '../../../../networks/useNetworks'
import { IdeaMilestoneDto, IdeaMilestoneNetworkDto } from '../idea.milestones.dto'
import { IdeaDto } from '../../../ideas.dto'
import { isValidAddressOrEmpty } from '../../../../util/addressValidator'
import { NetworkDisplayValue, Nil } from '../../../../util/types'
import { toNetworkDisplayValue, toNetworkPlanckValue } from '../../../../util/quota.util'

export interface IdeaMilestoneFormValues {
    subject: string
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
    beneficiary: Nil<string>
    currentNetwork: IdeaMilestoneNetworkFormValues
    additionalNetworks: IdeaMilestoneNetworkFormValues[]
}

export type IdeaMilestoneNetworkFormValues = Omit<IdeaMilestoneNetworkDto, 'value'> & { value: NetworkDisplayValue }

interface OwnProps {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
}

export type useIdeaMilestoneFormProps = OwnProps

const useIdeaMilestoneForm = ({ idea, ideaMilestone }: useIdeaMilestoneFormProps) => {
    const { t } = useTranslation()
    const { network, findNetwork } = useNetworks()

    const { validationSchema: detailsValidationSchema, initialValues: detailsInitialValues } = useMilestoneDetailsForm({
        details: ideaMilestone?.details,
    })

    const validationSchema = Yup.object().shape({
        beneficiary: Yup.string().test(
            'validate-address',
            t('idea.milestones.modal.form.wrongBeneficiaryAddressError'),
            (address) => isValidAddressOrEmpty(address, network.ss58Format),
        ),
        currentNetwork: Yup.object().shape({
            value: networkValueValidationSchema({ t, findNetwork }),
        }),
        additionalNetworks: Yup.array().of(
            Yup.object().shape({
                value: networkValueValidationSchema({ t, findNetwork }),
            }),
        ),
    })

    const extendedValidationSchema = Yup.object().shape({
        beneficiary: Yup.string()
            .required(t('idea.milestones.modal.form.emptyFieldError'))
            .test('validate-address', t('idea.milestones.modal.form.wrongBeneficiaryAddressError'), (address) =>
                isValidAddressOrEmpty(address, network.ss58Format),
            ),
        currentNetwork: Yup.object().shape({
            value: networkValueValidationSchema({ t, findNetwork, required: true }),
        }),
    })

    const toIdeaMilestoneNetworkFormValues = (
        ideaMilestoneNetworkDto: IdeaMilestoneNetworkDto,
    ): IdeaMilestoneNetworkFormValues => ({
        ...ideaMilestoneNetworkDto,
        value: toNetworkDisplayValue(
            ideaMilestoneNetworkDto.value,
            findNetwork(ideaMilestoneNetworkDto.name)!.decimals,
        ),
    })
    const toIdeaMilestoneNetworkDto = (
        ideaMilestoneNetworkFormValues: IdeaMilestoneNetworkFormValues,
    ): IdeaMilestoneNetworkDto => ({
        ...ideaMilestoneNetworkFormValues,
        value: toNetworkPlanckValue(
            ideaMilestoneNetworkFormValues.value,
            findNetwork(ideaMilestoneNetworkFormValues.name)!.decimals,
        )!,
    })
    const toIdeaMilestoneFormValues = (): IdeaMilestoneFormValues => {
        if (!ideaMilestone) {
            return {
                beneficiary: formatAddress(idea.beneficiary, network.ss58Format, false),
                currentNetwork: {
                    name: idea.currentNetwork.name,
                    value: '0' as NetworkDisplayValue,
                } as IdeaMilestoneNetworkFormValues,
                additionalNetworks: idea.additionalNetworks.map((n) => {
                    return { name: n.name, value: '0' as NetworkDisplayValue } as IdeaMilestoneNetworkFormValues
                }),
                ...detailsInitialValues,
            }
        }
        return {
            beneficiary: formatAddress(ideaMilestone.beneficiary, network.ss58Format, false),
            currentNetwork: toIdeaMilestoneNetworkFormValues(ideaMilestone.currentNetwork),
            additionalNetworks: ideaMilestone.additionalNetworks.map(toIdeaMilestoneNetworkFormValues),
            ...detailsInitialValues,
        }
    }
    const toIdeaMilestoneDto = (formValues: IdeaMilestoneFormValues): IdeaMilestoneDto => ({
        ...ideaMilestone!,
        beneficiary: formValues.beneficiary,
        currentNetwork: toIdeaMilestoneNetworkDto(formValues.currentNetwork),
        additionalNetworks: formValues.additionalNetworks.map(toIdeaMilestoneNetworkDto),
        details: {
            ...ideaMilestone!.details,
            subject: formValues.subject,
            dateFrom: formValues.dateFrom,
            dateTo: formValues.dateTo,
            description: formValues.description,
        },
    })

    return {
        initialValues: toIdeaMilestoneFormValues(),
        validationSchema: validationSchema.concat(detailsValidationSchema),
        extendedValidationSchema,
        toIdeaMilestoneDto,
        toIdeaMilestoneNetworkDto,
        onSubmitFallback: () => {},
    }
}

export default useIdeaMilestoneForm
