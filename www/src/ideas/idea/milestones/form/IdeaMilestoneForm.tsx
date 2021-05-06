import React, {PropsWithChildren, useMemo} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Formik} from "formik";
import {useTranslation} from "react-i18next";
import {
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto
} from "../idea.milestones.api";
import {IdeaMilestoneFormFields} from "./IdeaMilestoneFormFields";
import {Nil} from "../../../../util/types";
import {IdeaDto} from "../../../ideas.api";
import {getExtendedValidationSchema, getValidationSchema} from "./ideaMilestoneFormValidationSchemas";

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
        beneficiary: null,
        dateFrom: null,
        dateTo: null,
        description: null,
        networks: [{ name: network, value: 0 } as IdeaMilestoneNetworkDto]
    }
}

const mapIdeaMilestoneToIdeaMilestoneFormValues = (
    { subject, beneficiary, dateFrom, dateTo, description, networks }: IdeaMilestoneDto
): IdeaMilestoneFormValues => {
    return {
        subject,
        beneficiary,
        dateFrom,
        dateTo,
        description,
        networks
    }
}

const onSubmitFallback = () => { }

export interface IdeaMilestoneFormValues {
    subject: string,
    beneficiary: Nil<string>,
    dateFrom: Nil<Date>,
    dateTo: Nil<Date>,
    description: Nil<string>
    networks: IdeaMilestoneNetworkDto[]
}

interface Props {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
    readonly: boolean
    extendedValidation?: boolean
    onSubmit?: (values: IdeaMilestoneFormValues) => void
}

export const IdeaMilestoneForm = ({ idea, ideaMilestone, readonly, onSubmit, extendedValidation = false, children }: PropsWithChildren<Props>) => {

    const classes = useStyles()
    const { t } = useTranslation()

    const validationSchema = useMemo(() => getValidationSchema(t), [t])
    const extendedValidationSchema = useMemo(() => getExtendedValidationSchema(t), [t])

    const initialValues = ideaMilestone
        ? mapIdeaMilestoneToIdeaMilestoneFormValues(ideaMilestone)
        : createInitialIdeaMilestoneFormValuesObject(idea.networks[0].name)

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{...initialValues}}
            validationSchema={extendedValidation ?  extendedValidationSchema: validationSchema}
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
