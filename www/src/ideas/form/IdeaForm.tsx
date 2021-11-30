import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import InvertFoldedButton from '../../components/form/fold/InvertFoldedButton'
import { useFold } from '../../components/form/fold/useFold'
import FormFooter from '../../components/form/footer/FormFooter'
import { EditIdeaDto, IdeaDto } from '../ideas.dto'
import FoldedIdeaFormFields from './FoldedIdeaFormFields'
import IdeaFormFields from './IdeaFormFields'
import useIdeaForm, { IdeaFormValues } from './useIdeaForm'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        foldButton: {
            marginTop: '2em',
            alignSelf: 'flex-start',
        },
    }),
)

interface OwnProps {
    idea?: IdeaDto
    onSubmit: (idea: EditIdeaDto) => void
    extendedValidation?: boolean
    foldable?: boolean
}

export type IdeaFormProps = PropsWithChildren<OwnProps>

const IdeaForm = ({ idea, onSubmit, extendedValidation, foldable, children }: IdeaFormProps) => {
    const classes = useStyles()
    const { folded, invertFolded } = useFold(!!foldable)
    const { validationSchema, extendedValidationSchema, toFormValues, toEditIdeaDto } = useIdeaForm()

    const onFormikSubmit = (formIdea: IdeaFormValues) => onSubmit(toEditIdeaDto(formIdea))

    return (
        <Formik
            enableReinitialize={true}
            initialValues={toFormValues(idea)}
            validationSchema={extendedValidation ? validationSchema.concat(extendedValidationSchema) : validationSchema}
            onSubmit={onFormikSubmit}
        >
            {({ values, handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    {folded ? <FoldedIdeaFormFields values={values} /> : <IdeaFormFields values={values} />}
                    {foldable && <InvertFoldedButton folded={folded} invertFolded={invertFolded} />}
                    <FormFooter>{children}</FormFooter>
                </form>
            )}
        </Formik>
    )
}

export default IdeaForm
