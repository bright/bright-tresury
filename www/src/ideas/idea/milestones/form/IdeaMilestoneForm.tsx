import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import { IdeaMilestoneDto, IdeaMilestoneNetworkDto } from '../idea.milestones.dto'
import IdeaMilestoneFormFields from './fields/IdeaMilestoneFormFields'
import { Nil } from '../../../../util/types'
import { IdeaDto } from '../../../ideas.dto'
import useIdeaMilestoneForm from './useIdeaMilestoneForm'
import IdeaMilestoneFoldedFormFields from './fields/IdeaMilestoneFoldedFormFields'
import FormFooter from '../../../../components/form/footer/FormFooter'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface IdeaMilestoneFormValues {
    subject: string
    beneficiary: Nil<string>
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
    networks: IdeaMilestoneNetworkDto[]
}

interface OwnProps {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
    readonly: boolean
    folded?: boolean
    extendedValidation?: boolean
    onSubmit?: (values: IdeaMilestoneFormValues) => void
}

export type IdeaMilestoneFormProps = OwnProps

const IdeaMilestoneForm = ({
    idea,
    ideaMilestone,
    readonly,
    folded = false,
    extendedValidation = false,
    onSubmit,
    children,
}: PropsWithChildren<IdeaMilestoneFormProps>) => {
    const classes = useStyles()

    const { initialValues, validationSchema, extendedValidationSchema, onSubmitFallback } = useIdeaMilestoneForm({
        idea,
        ideaMilestone,
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{ ...initialValues }}
            validationSchema={extendedValidation ? extendedValidationSchema : validationSchema}
            onSubmit={onSubmit ?? onSubmitFallback}
        >
            {({ values, handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    {folded ? (
                        <IdeaMilestoneFoldedFormFields values={values} readonly={readonly} />
                    ) : (
                        <IdeaMilestoneFormFields values={values} readonly={readonly} />
                    )}
                    <FormFooter>{children}</FormFooter>
                </form>
            )}
        </Formik>
    )
}

export default IdeaMilestoneForm
