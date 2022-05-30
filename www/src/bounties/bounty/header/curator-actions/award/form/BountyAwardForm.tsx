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
import BountyAwardFormFields from './BountyAwardFormFields'

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

export type BountyAwardFormProps = PropsWithChildren<OwnProps>

const BountyAwardForm = ({ bounty, onSubmit, children }: BountyAwardFormProps) => {
    const classes = useStyles()
    const { hasDetails } = useBounty(bounty)
    const { folded, invertFolded } = useFold(true)
    const { beneficiaryValidationSchema, validationSchema, initialValues, patchParams } = useBountyEdit(bounty)

    const onSubmitForm = (formValues: BountyEditFormValues) => {
        const params = patchParams(formValues)
        return onSubmit(params)
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={
                hasDetails ? validationSchema.concat(beneficiaryValidationSchema) : beneficiaryValidationSchema
            }
            onSubmit={onSubmitForm}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        {folded ? <BountyAwardFormFields /> : <BountyEditFormFields bounty={bounty} />}
                        {hasDetails ? <InvertFoldedButton folded={folded} invertFolded={invertFolded} /> : null}
                        <FormFooter>{children}</FormFooter>
                    </form>
                </>
            )}
        </Formik>
    )
}

export default BountyAwardForm
