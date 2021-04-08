import React, {PropsWithChildren} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Formik} from "formik";
import {useTranslation} from "react-i18next";
import * as Yup from 'yup'
import {IdeaMilestoneNetworkDto} from "../idea.milestones.api";
import {IdeaMilestoneFormFields} from "./IdeaMilestoneFormFields";

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

export interface IdeaMilestoneFormValues {
    subject: string,
    dateFrom?: Date | null,
    dateTo?: Date | null,
    description?: string | null
    networks: IdeaMilestoneNetworkDto[]
}

interface Props {
    values: IdeaMilestoneFormValues
    readonly : boolean
    onSubmit: (ideaMilestone: IdeaMilestoneFormValues) => void
}

export const IdeaMilestoneForm = ({ values, readonly, onSubmit, children,  }: PropsWithChildren<Props>) => {

    const classes = useStyles()
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        subject: Yup.string().required(t('idea.milestones.modal.form.emptyFieldError'))
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{...values}}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({ values, handleSubmit }) =>
                <form className={classes.form} autoComplete='off' onSubmit={handleSubmit}>
                    <IdeaMilestoneFormFields values={values} readonly={readonly} />
                    <div className={classes.buttons}>
                        {children}
                    </div>
                </form>
            }
        </Formik>
    );
}
