import React, {PropsWithChildren} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Formik} from "formik";
import {useTranslation} from "react-i18next";
import * as Yup from 'yup'
import {
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto
} from "../idea.milestones.api";
import {IdeaMilestoneFormFields} from "./IdeaMilestoneFormFields";
import {Nil} from "../../../../util/types";
import {IdeaDto} from "../../../ideas.api";

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        buttons: {
            display: 'flex',
            paddingTop: 40,
            justifyContent: 'space-between'
        },
    }),
);

const createInitialIdeaMilestoneFormValuesObject = (network: string): IdeaMilestoneFormValues => {
    return {
        subject: '',
        dateFrom: null,
        dateTo: null,
        description: null,
        networks: [{ name: network, value: 0 } as IdeaMilestoneNetworkDto]
    }
}

const mapIdeaMilestoneToIdeaMilestoneFormValues = (
    { subject, dateFrom, dateTo, description, networks }: IdeaMilestoneDto
): IdeaMilestoneFormValues => {
    return {
        subject,
        dateFrom,
        dateTo,
        description,
        networks
    }
}

const onSubmitFallback = () => { }

export interface IdeaMilestoneFormValues {
    subject: string,
    dateFrom: Nil<Date>,
    dateTo: Nil<Date>,
    description: Nil<string>
    networks: IdeaMilestoneNetworkDto[]
}

interface Props {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
    readonly: boolean
    onSubmit?: (values: IdeaMilestoneFormValues) => void
}

export const IdeaMilestoneForm = ({ idea, ideaMilestone, readonly, onSubmit, children }: PropsWithChildren<Props>) => {

    const classes = useStyles()
    const { t } = useTranslation()

    const initialValues = ideaMilestone
        ? mapIdeaMilestoneToIdeaMilestoneFormValues(ideaMilestone)
        : createInitialIdeaMilestoneFormValuesObject(idea.networks[0].name)

    const validationSchema = Yup.object({
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

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{...initialValues}}
            validationSchema={validationSchema}
            onSubmit={onSubmit ?? onSubmitFallback}>
            {({ values, handleSubmit }) =>
                <form className={classes.form} autoComplete='off' onSubmit={handleSubmit}>
                    <IdeaMilestoneFormFields values={values} readonly={readonly} />
                    <div className={classes.buttons}>
                        {children}
                    </div>
                </form>
            }
        </Formik>
    )
}
