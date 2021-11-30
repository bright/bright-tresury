import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import FormFooter from '../../../components/form/footer/FormFooter'
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

    const onSubmitForm = (formValues: BountyEditFormValues) => {
        const params = patchParams(formValues)
        return onSubmit(params)
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSubmitForm}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <BountyEditFormFields bounty={bounty} />
                        <FormFooter>{children}</FormFooter>
                    </form>
                </>
            )}
        </Formik>
    )
}

export default BountyEditForm
