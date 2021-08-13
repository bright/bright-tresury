import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import useMilestoneDetailsForm from '../../../../milestone-details/useMilestoneDetailsForm'
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

    const { validationSchema: detailsValidationSchema, initialValues: detailsInitialValues } = useMilestoneDetailsForm({
        details: ideaMilestone?.details,
    })

    const validationSchema = Yup.object().shape({
        beneficiary: Yup.string().test(
            'validate-address',
            t('idea.milestones.modal.form.wrongBeneficiaryAddressError'),
            isValidAddressOrEmpty,
        ),
        networks: Yup.array().of(
            Yup.object().shape({
                value: Yup.number().min(0, t('idea.milestones.modal.form.valueCannotBeLessThanZero')),
            }),
        ),
    })

    const extendedValidationSchema = Yup.object().shape({
        beneficiary: Yup.string()
            .required(t('idea.milestones.modal.form.emptyFieldError'))
            .test(
                'validate-address',
                t('idea.milestones.modal.form.wrongBeneficiaryAddressError'),
                isValidAddressOrEmpty,
            ),
        networks: Yup.array().of(
            Yup.object().shape({
                value: Yup.number()
                    .required(t('idea.milestones.modal.form.emptyFieldError'))
                    .moreThan(0, t('idea.milestones.modal.form.nonZeroFieldError')),
            }),
        ),
    })

    const onSubmitFallback = () => {}

    const emptyValues = (idea: IdeaDto): IdeaMilestoneFormValues => {
        return {
            beneficiary: idea.beneficiary,
            networks: [idea.currentNetwork, ...idea.additionalNetworks].map((n) => {
                return { name: n.name, value: 0 } as IdeaMilestoneNetworkDto
            }),
            ...detailsInitialValues,
        }
    }

    const valuesFromDto = ({ beneficiary, networks }: IdeaMilestoneDto): IdeaMilestoneFormValues => {
        return {
            beneficiary,
            networks,
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
