import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import FormFooter from '../../components/form/footer/FormFooter'
import { useModal } from '../../components/modal/useModal'
import SubmitBountyModal from '../create/SubmitBountyModal'
import BountyFormFields from './BountyFormFields'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface BountyFormValues {
    blockchainDescription: string
    value: number
    title: string
    field: string
    description: string
}

interface OwnProps {}

export type IdeaFormProps = PropsWithChildren<OwnProps>

const BountyForm = ({ children }: IdeaFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const submitBountyModal = useModal()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('bounty.form.emptyFieldError')),
        blockchainDescription: Yup.string().required(t('bounty.form.emptyFieldError')),
        value: Yup.number().required(t('bounty.form.emptyFieldError')).moreThan(0, t('bounty.form.nonZeroFieldError')),
    })

    const initialValues: BountyFormValues = {
        blockchainDescription: '',
        value: 0,
        title: '',
        field: '',
        description: '',
    }

    const onSubmit = () => {
        submitBountyModal.open()
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <BountyFormFields />
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <SubmitBountyModal
                        open={submitBountyModal.visible}
                        onClose={submitBountyModal.close}
                        bounty={values}
                    />
                </>
            )}
        </Formik>
    )
}

export default BountyForm
