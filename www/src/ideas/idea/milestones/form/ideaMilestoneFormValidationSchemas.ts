import * as Yup from "yup";
import {TFunction} from "i18next";

export const getValidationSchema = (t: TFunction) => Yup.object().shape({
    subject: Yup.string()
        .required(t('idea.milestones.modal.form.emptyFieldError')),
    dateFrom: Yup.date()
        // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
        .transform(value => value ? new Date(value) : value)
        .nullable(),
    dateTo: Yup.date()
        // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
        .transform(value => value ? new Date(value) : value)
        .nullable()
        .min(
            Yup.ref('dateFrom'),
            t('idea.milestones.modal.form.endDatePriorToStartDateError')
        )
})

export const getExtendedValidationSchema = (t: TFunction) => Yup.object().shape({
    subject: Yup.string()
        .required(t('idea.milestones.modal.form.emptyFieldError')),
    dateFrom: Yup.date()
        // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
        .transform(value => value ? new Date(value) : value)
        .nullable(),
    dateTo: Yup.date()
        // Date is transformed because in form date is like "yyyy-mm-dd" but we need the full date obj to correctly proceed validation
        .transform(value => value ? new Date(value) : value)
        .nullable()
        .min(
            Yup.ref('dateFrom'),
            t('idea.milestones.modal.form.endDatePriorToStartDateError')
        ),
    networks: Yup.array()
        .of(Yup.object().shape({
            value: Yup.number()
                .required(t('idea.milestones.modal.form.emptyFieldError'))
                .moreThan(0, (t('idea.milestones.modal.form.nonZeroFieldError'))),
        }))
})
