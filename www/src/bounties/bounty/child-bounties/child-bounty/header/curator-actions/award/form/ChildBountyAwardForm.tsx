import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren } from 'react'
import FormFooter from '../../../../../../../../components/form/footer/FormFooter'
import { useTranslation } from 'react-i18next'
import { useAwardChildBounty } from '../useAwardChildBounty'
import { useModal } from '../../../../../../../../components/modal/useModal'
import AwardChildBountyModal from '../AwardChildBountyModal'
import BeneficiaryField from './BeneficiaryField'

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
    blockchainIndex: number
    parentBountyBlockchainIndex: number
}

export type ChildBountyAwardFormProps = PropsWithChildren<OwnProps>

const ChildBountyAwardForm = ({
    blockchainIndex,
    parentBountyBlockchainIndex,
    children,
}: ChildBountyAwardFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const submitModal = useModal()

    const { validationSchema, initialValues, toAwardChildBountyParams } = useAwardChildBounty({
        blockchainIndex,
        parentBountyBlockchainIndex,
    })

    const onSubmit = () => {
        submitModal.open()
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={false}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <BeneficiaryField />
                        <FormFooter>{children}</FormFooter>
                    </form>
                    <AwardChildBountyModal
                        open={submitModal.visible}
                        onClose={submitModal.close}
                        awardChildBounty={toAwardChildBountyParams(values)}
                    />
                </>
            )}
        </Formik>
    )
}

export default ChildBountyAwardForm
