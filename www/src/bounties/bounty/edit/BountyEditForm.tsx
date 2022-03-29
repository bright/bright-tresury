import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import ConfirmBeneficiaryWarningModal from '../../../components/form/ConfirmBeneficiaryWarningModal'
import FormFooter from '../../../components/form/footer/FormFooter'
import { useConfirmBeneficiaryWarningModal } from '../../../components/form/useConfirmBeneficiaryWarningModal'
import { PatchBountyParams } from '../../bounties.api'
import { BountyDto } from '../../bounties.dto'
import BountyEditFormFields from './BountyEditFormFields'
import { BountyEditFormValues, useBountyEdit } from './useBountyEdit'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {
    bounty: BountyDto
    onSubmit: (params: PatchBountyParams) => Promise<void>
}

export type BountyEditFormProps = PropsWithChildren<OwnProps>

const BountyEditForm = ({ bounty, onSubmit, children }: BountyEditFormProps) => {
    const classes = useStyles()
    const { validationSchema, initialValues, patchParams } = useBountyEdit(bounty)

    const submit = (formValues: BountyEditFormValues) => {
        const params = patchParams(formValues)
        return onSubmit(params)
    }
    const { close, visible, onFormSubmit, handleModalSubmit } = useConfirmBeneficiaryWarningModal({
        initialValues,
        submit,
    })

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onFormSubmit}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <BountyEditFormFields bounty={bounty} />
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

export default BountyEditForm
