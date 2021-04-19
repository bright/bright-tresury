import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Formik} from "formik";
import {useTranslation} from "react-i18next";
import * as Yup from 'yup'
import {
    createIdeaMilestone,
    CreateIdeaMilestoneDto,
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto, patchIdeaMilestone, PatchIdeaMilestoneDto
} from "../idea.milestones.api";
import {IdeaMilestoneFormFields} from "./IdeaMilestoneFormFields";
import {Nil} from "../../../../util/types";
import {IdeaDto} from "../../../ideas.api";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

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

export enum IdeaMilestoneFormMode {
    Create = 'create',
    Edit = 'edit',
    Display = 'display'
}

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
    mode: IdeaMilestoneFormMode
    onSuccessfulSubmit?: () => void
}

export const IdeaMilestoneForm = ({ idea, ideaMilestone, mode, onSuccessfulSubmit, children }: PropsWithChildren<Props>) => {

    const classes = useStyles()
    const { t } = useTranslation()

    const [showApiCallError, setShowApiCallError] = useState<boolean>(false)

    const readonly = mode === IdeaMilestoneFormMode.Display

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

    const initialValues = ideaMilestone
        ? mapIdeaMilestoneToIdeaMilestoneFormValues(ideaMilestone)
        : createInitialIdeaMilestoneFormValuesObject(idea.networks[0].name)

    const onSubmit = async ({ subject, dateFrom, dateTo, description, networks }: IdeaMilestoneFormValues) => {

        setShowApiCallError(false)

        if (mode === IdeaMilestoneFormMode.Create) {
            const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
                subject,
                dateFrom,
                dateTo,
                description,
                networks
            }
            createIdeaMilestone(idea.id, createIdeaMilestoneDto)
                .then(() => {
                    if (onSuccessfulSubmit) {
                        onSuccessfulSubmit()
                    }
                })
                .catch(() => setShowApiCallError(true))
        }

        if (mode === IdeaMilestoneFormMode.Edit && ideaMilestone) {
            const patchIdeaMilestoneDto: PatchIdeaMilestoneDto = {
                subject,
                dateFrom,
                dateTo,
                description,
                networks
            }
            patchIdeaMilestone(idea.id, ideaMilestone.id, patchIdeaMilestoneDto)
                .then(() => {
                    if (onSuccessfulSubmit) {
                        onSuccessfulSubmit()
                    }
                })
                .catch(() => setShowApiCallError(true))
        }
    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{...initialValues}}
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
            <Snackbar open={showApiCallError} autoHideDuration={5000} onClose={() => setShowApiCallError(false)}>
                <Alert onClose={() => setShowApiCallError(false)} severity="error">
                    {t('idea.milestones.modal.form.apiCallErrorMessage')}
                </Alert>
            </Snackbar>
        </>

    );
}
