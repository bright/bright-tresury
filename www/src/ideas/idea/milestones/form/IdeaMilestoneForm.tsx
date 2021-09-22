import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import FormFooter from '../../../../components/form/footer/FormFooter'
import { Nil } from '../../../../util/types'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto, IdeaMilestoneNetworkDto } from '../idea.milestones.dto'
import IdeaMilestoneFoldedFormFields from './fields/IdeaMilestoneFoldedFormFields'
import IdeaMilestoneFormFields from './fields/IdeaMilestoneFormFields'
import useIdeaMilestoneForm from './useIdeaMilestoneForm'

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
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
    beneficiary: Nil<string>
    currentNetwork: IdeaMilestoneNetworkDto
    additionalNetworks: IdeaMilestoneNetworkDto[]
}

interface OwnProps {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
    folded?: boolean
    extendedValidation?: boolean
    onSubmit?: (values: IdeaMilestoneFormValues) => void
    onTurnIntoProposalClick?: (ideaMilestoneDto: IdeaMilestoneDto) => void
}

export const mergeFormValuesWithIdeaMilestone = (
    formValues: IdeaMilestoneFormValues,
    ideaMilestone: IdeaMilestoneDto,
): IdeaMilestoneDto => {
    return {
        ...ideaMilestone,
        beneficiary: formValues.beneficiary,
        currentNetwork: formValues.currentNetwork,
        additionalNetworks: formValues.additionalNetworks,
        details: {
            ...ideaMilestone.details,
            subject: formValues.subject,
            dateFrom: formValues.dateFrom,
            dateTo: formValues.dateTo,
            description: formValues.description,
        },
    }
}

export type IdeaMilestoneFormProps = PropsWithChildren<OwnProps>

const IdeaMilestoneForm = ({
    idea,
    ideaMilestone,
    folded = false,
    extendedValidation = false,
    onSubmit,
    onTurnIntoProposalClick,
    children,
}: IdeaMilestoneFormProps) => {
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
                        <IdeaMilestoneFoldedFormFields values={values} ideaMilestone={ideaMilestone} idea={idea} />
                    ) : (
                        <IdeaMilestoneFormFields
                            values={values}
                            ideaMilestone={ideaMilestone}
                            idea={idea}
                            onTurnIntoProposalClick={onTurnIntoProposalClick}
                        />
                    )}
                    <FormFooter>{children}</FormFooter>
                </form>
            )}
        </Formik>
    )
}

export default IdeaMilestoneForm
