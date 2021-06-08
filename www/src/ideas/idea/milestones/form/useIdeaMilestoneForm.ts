import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { IdeaMilestoneDto, IdeaMilestoneNetworkDto } from '../idea.milestones.dto'
import { IdeaMilestoneFormValues } from './IdeaMilestoneForm'
import { IdeaDto } from '../../../ideas.dto'
import { isValidAddressOrEmpty } from '../../../../util/addressValidator'

interface Props {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
}

export const useIdeaMilestoneForm = ({ idea, ideaMilestone }: Props) => {
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required(t('idea.milestones.modal.form.emptyFieldError')),
        beneficiary: Yup.string().test(
            'validate-address',
            t('idea.milestones.modal.form.wrongBeneficiaryAddressError'),
            isValidAddressOrEmpty,
        ),
        dateFrom: Yup.date()
            // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
            .transform((value) => (value ? new Date(value) : value))
            .nullable(),
        dateTo: Yup.date()
            // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
            .transform((value) => (value ? new Date(value) : value))
            .nullable()
            .min(Yup.ref('dateFrom'), t('idea.milestones.modal.form.endDatePriorToStartDateError')),
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
            subject: '',
            beneficiary: idea.beneficiary,
            dateFrom: null,
            dateTo: null,
            description: '',
            networks: [{ name: idea.networks[0].name, value: 0 } as IdeaMilestoneNetworkDto],
        }
    }

    const valuesFromDto = ({
        subject,
        beneficiary,
        dateFrom,
        dateTo,
        description,
        networks,
    }: IdeaMilestoneDto): IdeaMilestoneFormValues => {
        return {
            subject,
            beneficiary,
            dateFrom,
            dateTo,
            description,
            networks,
        }
    }

    const initialValues = ideaMilestone ? valuesFromDto(ideaMilestone) : emptyValues(idea)

    return {
        initialValues,
        validationSchema,
        extendedValidationSchema,
        onSubmitFallback,
    }
}
