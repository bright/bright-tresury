import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { formatAddress } from '../../../../components/identicon/utils'
import useMilestoneDetailsForm from '../../../../milestone-details/useMilestoneDetailsForm'
import { useNetworks } from '../../../../networks/useNetworks'
import { IdeaMilestoneDto, IdeaMilestoneNetworkDto } from '../idea.milestones.dto'
import { IdeaMilestoneFormValues } from './IdeaMilestoneForm'
import { IdeaDto } from '../../../ideas.dto'
import { isValidAddressOrEmpty } from '../../../../util/addressValidator'

interface OwnProps {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
}

export type useIdeaMilestoneFormProps = OwnProps

const useIdeaMilestoneForm = ({ idea, ideaMilestone }: useIdeaMilestoneFormProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    const { validationSchema: detailsValidationSchema, initialValues: detailsInitialValues } = useMilestoneDetailsForm({
        details: ideaMilestone?.details,
    })

    const validationSchema = Yup.object().shape({
        beneficiary: Yup.string().test(
            'validate-address',
            t('idea.milestones.modal.form.wrongBeneficiaryAddressError'),
            (address) => isValidAddressOrEmpty(address, network.ss58Format),
        ),
        otherNetworks: Yup.array().of(
            Yup.object().shape({
                value: Yup.number().min(0, t('idea.milestones.modal.form.valueCannotBeLessThanZero')),
            }),
        ),
        currentNetwork: Yup.object().shape({
            value: Yup.number().min(0, t('idea.milestones.modal.form.valueCannotBeLessThanZero')),
        }),
    })

    const extendedValidationSchema = Yup.object().shape({
        beneficiary: Yup.string()
            .required(t('idea.milestones.modal.form.emptyFieldError'))
            .test('validate-address', t('idea.milestones.modal.form.wrongBeneficiaryAddressError'), (address) =>
                isValidAddressOrEmpty(address, network.ss58Format),
            ),
        currentNetwork: Yup.object().shape({
            value: Yup.number()
                .required(t('idea.milestones.modal.form.emptyFieldError'))
                .moreThan(0, t('idea.milestones.modal.form.nonZeroFieldError')),
        }),
    })

    const onSubmitFallback = () => {}

    const emptyValues = (idea: IdeaDto): IdeaMilestoneFormValues => {
        return {
            beneficiary: formatAddress(idea.beneficiary, network.ss58Format, false),
            currentNetwork: { name: idea.currentNetwork.name, value: 0 } as IdeaMilestoneNetworkDto,
            additionalNetworks: idea.additionalNetworks.map((n) => {
                return { name: n.name, value: 0 } as IdeaMilestoneNetworkDto
            }),
            ...detailsInitialValues,
        }
    }

    const valuesFromDto = ({
        beneficiary,
        currentNetwork,
        additionalNetworks,
    }: IdeaMilestoneDto): IdeaMilestoneFormValues => {
        return {
            beneficiary: formatAddress(beneficiary, network.ss58Format, false),
            currentNetwork,
            additionalNetworks,
            ...detailsInitialValues,
        }
    }

    const initialValues = ideaMilestone ? valuesFromDto(ideaMilestone) : emptyValues(idea)

    return {
        initialValues,
        validationSchema: validationSchema.concat(detailsValidationSchema),
        extendedValidationSchema,
        onSubmitFallback,
    }
}

export default useIdeaMilestoneForm
