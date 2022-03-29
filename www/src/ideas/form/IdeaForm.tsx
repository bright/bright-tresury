import { createStyles, makeStyles } from '@material-ui/core/styles'
import { encodeAddress } from '@polkadot/util-crypto'
import { Formik } from 'formik'
import { FormikHelpers } from 'formik/dist/types'
import React, { PropsWithChildren } from 'react'
import ConfirmBeneficiaryWarningModal from '../../components/form/ConfirmBeneficiaryWarningModal'
import InvertFoldedButton from '../../components/form/fold/InvertFoldedButton'
import { useFold } from '../../components/form/fold/useFold'
import FormFooter from '../../components/form/footer/FormFooter'
import { useConfirmBeneficiaryWarningModal } from '../../components/form/useConfirmBeneficiaryWarningModal'
import { useModal } from '../../components/modal/useModal'
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

    const submit = (formIdea: IdeaFormValues) => onSubmit(toEditIdeaDto(formIdea))
    const { close, visible, onFormSubmit, handleModalSubmit } = useConfirmBeneficiaryWarningModal({
        initialValues: toFormValues(idea),
        submit,
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={toFormValues(idea)}
            validationSchema={extendedValidation ? validationSchema.concat(extendedValidationSchema) : validationSchema}
            onSubmit={onFormSubmit}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        {folded ? <FoldedIdeaFormFields values={values} /> : <IdeaFormFields values={values} />}
                        {foldable && <InvertFoldedButton folded={folded} invertFolded={invertFolded} />}
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <ConfirmBeneficiaryWarningModal
                        beneficiary={values.beneficiary}
                        open={visible}
                        onClose={close}
                        onSubmit={() => {
                            handleModalSubmit(values)
                        }}
                    />
                </>
            )}
        </Formik>
    )
}

export default IdeaForm
