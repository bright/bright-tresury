import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import { PatchChildBountyParams } from '../../child-bounties.api'
import { ChildBountyEditFormValues, useChildBountyEdit } from './useChildBountyEdit'
import FormFooter from '../../../../../components/form/footer/FormFooter'
import ChildBountyEditFormFields from './ChildBountyEditFormFields'

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
    childBounty: ChildBountyDto
    onSubmit: (params: PatchChildBountyParams) => Promise<void>
}

export type ChildBountyEditFormProps = PropsWithChildren<OwnProps>

const ChildBountyEditForm = ({ childBounty, onSubmit, children }: ChildBountyEditFormProps) => {
    const classes = useStyles()
    const { validationSchema, initialValues, patchParams } = useChildBountyEdit(childBounty)

    const submit = (formValues: ChildBountyEditFormValues) => {
        const params = patchParams(formValues)
        return onSubmit(params)
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={submit}
        >
            {({ handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <ChildBountyEditFormFields />
                        <FormFooter>{children}</FormFooter>
                    </form>
                </>
            )}
        </Formik>
    )
}

export default ChildBountyEditForm
