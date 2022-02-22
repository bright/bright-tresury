import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import InvertFoldedButton from '../../../../../../components/form/fold/InvertFoldedButton'
import { useFold } from '../../../../../../components/form/fold/useFold'
import FormFooter from '../../../../../../components/form/footer/FormFooter'
import { PatchBountyParams } from '../../../../../bounties.api'
import { BountyDto } from '../../../../../bounties.dto'
import BountyEditFormFields from '../../../../edit/BountyEditFormFields'
import { BountyEditFormValues, useBountyEdit } from '../../../../edit/useBountyEdit'
import { useBounty } from '../../../../useBounty'
import BountyExtendExpiryFormFields from './BountyExtendExpiryFormFields'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface BountyExtendExpiryFormValues extends BountyEditFormValues {
    remark: string
}

interface OwnProps {
    bounty: BountyDto
    onSubmit: (params: PatchBountyParams, remark: string) => Promise<void>
}

export type BountyExtendRemarkFormProps = PropsWithChildren<OwnProps>

const BountyExtendExpiryForm = ({ bounty, onSubmit, children }: BountyExtendRemarkFormProps) => {
    const classes = useStyles()
    const { hasDetails } = useBounty(bounty)
    const { folded, invertFolded } = useFold(true)
    const { validationSchema, remarkValidationSchema, initialValues: editInitialValues, patchParams } = useBountyEdit(
        bounty,
    )

    const onSubmitForm = (formValues: BountyExtendExpiryFormValues) => {
        const params = patchParams(formValues)
        return onSubmit(params, formValues.remark)
    }

    const initialValues: BountyExtendExpiryFormValues = { ...editInitialValues, remark: '' }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={hasDetails ? validationSchema.concat(remarkValidationSchema) : remarkValidationSchema}
            onSubmit={onSubmitForm}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <BountyExtendExpiryFormFields />
                        {!folded && hasDetails ? <BountyEditFormFields bounty={bounty} /> : null}
                        {hasDetails ? <InvertFoldedButton folded={folded} invertFolded={invertFolded} /> : null}
                        <FormFooter>{children}</FormFooter>
                    </form>
                </>
            )}
        </Formik>
    )
}

export default BountyExtendExpiryForm
