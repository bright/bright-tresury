import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import FormFooter from '../../../../components/form/footer/FormFooter'
import { IdeaDto } from '../../../ideas.dto'
import { IdeaMilestoneDto } from '../idea.milestones.dto'
import IdeaMilestoneFoldedFormFields from './fields/IdeaMilestoneFoldedFormFields'
import IdeaMilestoneFormFields from './fields/IdeaMilestoneFormFields'
import useIdeaMilestoneForm, { IdeaMilestoneFormValues } from './useIdeaMilestoneForm'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {
    idea: IdeaDto
    ideaMilestone?: IdeaMilestoneDto
    folded?: boolean
    extendedValidation?: boolean
    onSubmit?: (values: IdeaMilestoneFormValues) => void
    onTurnIntoProposalClick?: (ideaMilestoneDto: IdeaMilestoneDto) => void
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
