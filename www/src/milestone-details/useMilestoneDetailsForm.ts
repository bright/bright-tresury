import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { MilestoneDetailsDto } from './milestone-details.dto'

interface OwnProps {
    details?: MilestoneDetailsDto
}

export type UseMilestoneDetailsFormProps = OwnProps

const useMilestoneDetailsForm = ({ details }: UseMilestoneDetailsFormProps) => {
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required(t('milestoneDetails.form.emptyFieldError')),
        dateFrom: Yup.date()
            // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
            .transform((value) => (value ? new Date(value) : value))
            .nullable(),
        dateTo: Yup.date()
            // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
            .transform((value) => (value ? new Date(value) : value))
            .nullable()
            .min(Yup.ref('dateFrom'), t('milestoneDetails.form.endDatePriorToStartDateError')),
    })

    const emptyValues = () => {
        return {
            subject: '',
            dateFrom: null,
            dateTo: null,
            description: '',
        }
    }

    const valuesFromDto = ({ subject, dateFrom, dateTo, description }: MilestoneDetailsDto) => {
        return {
            subject,
            dateFrom,
            dateTo,
            description,
        }
    }

    const initialValues = details ? valuesFromDto(details) : emptyValues()

    return {
        initialValues,
        validationSchema,
    }
}

export default useMilestoneDetailsForm
